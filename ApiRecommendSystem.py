import pandas as pd
import numpy as np
from flask import Flask, jsonify
from sqlalchemy import create_engine
import time
from sqlalchemy.exc import OperationalError
engine = create_engine('mysql+mysqlconnector://root:admin123@mysql:3306/eduflex')

# Hàm để tải dữ liệu implicit feedback từ bảng lichsu_hoctap
def load_lichsu_hoctap():
    retries = 5
    for i in range(retries):
        try:
            query_history = "SELECT id_ng_dung, id_mon_hoc, timestamp, duration, frequency FROM lichsu_hoctap"
            df_history = pd.read_sql(query_history, engine)
            print("Kiểu dữ liệu của các cột trong df_history (lichsu_hoctap):")
            print(df_history.dtypes)
            print("Danh sách tất cả người dùng trong df_history (lichsu_hoctap):")
            print(df_history['id_ng_dung'].unique())
            print(f"Số lượng bản ghi trong df_history (lichsu_hoctap): {len(df_history)}")
            df_history['id_ng_dung'] = df_history['id_ng_dung'].astype(str)
            df_history['id_mon_hoc'] = df_history['id_mon_hoc'].astype(str)
            return df_history
        except OperationalError as e:
            if i < retries - 1:
                print(f"Failed to connect to MySQL, retrying in 5 seconds... ({i+1}/{retries})")
                time.sleep(5)
            else:
                raise e

# Khởi tạo Flask app
app = Flask(__name__)

# Hàm lấy danh mục yêu thích của người dùng dựa trên implicit feedback
def get_preferred_categories(user_id_str, df_history, df_courses):
    user_history = df_history[df_history['id_ng_dung'] == user_id_str]
    if user_history.empty:
        return []
    user_history_grouped = user_history.groupby('id_mon_hoc').agg({
        'frequency': 'sum',
        'duration': 'sum'
    }).reset_index()
    alpha, beta = 0.4, 0.6
    user_history_grouped['implicit_score'] = alpha * user_history_grouped['frequency'] + beta * user_history_grouped['duration']
    top_courses = user_history_grouped.nlargest(3, 'implicit_score')['id_mon_hoc'].tolist()
    print(f"Top courses for user {user_id_str}: {top_courses}")
    df_courses['id'] = df_courses['id'].astype(str)
    preferred_categories = df_courses[df_courses['id'].isin(top_courses)]['id_category'].unique()
    print(f"Preferred categories for user {user_id_str}: {preferred_categories}")
    return preferred_categories.tolist()

# API endpoint để gợi ý môn học cho người dùng
@app.route('/recommend/<int:user_id>', methods=['GET'])
def recommend(user_id):
    df_history = load_lichsu_hoctap()
    user_check = pd.read_sql(f"SELECT id FROM nguoi_dung WHERE id = {user_id}", engine)
    if user_check.empty:
        return jsonify({'error': 'Người dùng không tồn tại'}), 404
    user_id_str = str(user_id)
    monhoc_df = pd.read_sql("SELECT id, id_category FROM mon_hoc", engine)
    all_items = monhoc_df['id'].tolist()
    learned_items = df_history[df_history['id_ng_dung'] == user_id_str]['id_mon_hoc'].tolist()
    print(f"Các môn học đã học bởi user {user_id}: {learned_items}")
    preferred_categories = get_preferred_categories(user_id_str, df_history, monhoc_df)
    print(f"Danh mục yêu thích của user {user_id}: {preferred_categories}")
    if not preferred_categories:
        monhoc_df = pd.read_sql("SELECT id FROM mon_hoc WHERE status_course = 'ACTIVE' ORDER BY ngay_tao DESC LIMIT 5", engine)
        candidate_items = monhoc_df['id'].tolist()
    else:
        monhoc_df['id'] = monhoc_df['id'].astype(str)
        candidate_items = monhoc_df[
            (monhoc_df['id_category'].isin(preferred_categories)) & 
            (~monhoc_df['id'].isin(learned_items))
        ]['id'].tolist()
    print(f"Các môn học tiềm năng sau Content Filtering: {candidate_items}")
    if not candidate_items:
        monhoc_df = pd.read_sql("SELECT id FROM mon_hoc WHERE status_course = 'ACTIVE' ORDER BY ngay_tao DESC LIMIT 5", engine)
        candidate_items = monhoc_df['id'].tolist()
    recommendations = []
    all_users_history = df_history.groupby('id_mon_hoc').agg({
        'frequency': 'sum',
        'duration': 'sum'
    }).reset_index()
    alpha, beta = 0.4, 0.6
    all_users_history['popularity_score'] = alpha * all_users_history['frequency'] + beta * all_users_history['duration']
    for item_id in candidate_items:
        item_history = all_users_history[all_users_history['id_mon_hoc'] == str(item_id)]
        score = item_history['popularity_score'].iloc[0] if not item_history.empty else 0
        if score == 0 and preferred_categories:
            item_category = monhoc_df[monhoc_df['id'] == str(item_id)]['id_category'].iloc[0]
            score = 1.0 if item_category in preferred_categories else 0.0
        recommendations.append((item_id, score))
    recommendations.sort(key=lambda x: x[1], reverse=True)
    top_recommendations = recommendations[:5]
    result = []
    for item_id, score in top_recommendations:
        monhoc_info = pd.read_sql(f"SELECT ten_mon, mo_ta, anh_mon_hoc FROM mon_hoc WHERE id = {item_id}", engine)
        result.append({
            'monhoc_id': int(item_id),
            'ten_mon': str(monhoc_info['ten_mon'].iloc[0] if not monhoc_info.empty else "Không có dữ liệu"),
            'mo_ta': str(monhoc_info['mo_ta'].iloc[0] if not monhoc_info.empty else "Không có dữ liệu"),
            'anh_mon_hoc': str(monhoc_info['anh_mon_hoc'].iloc[0] if not monhoc_info.empty else "Không có dữ liệu"),
            'predicted_score': float(round(score, 2))
        })
    return jsonify({'user_id': user_id, 'recommendations': result})

# Chạy ứng dụng
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)