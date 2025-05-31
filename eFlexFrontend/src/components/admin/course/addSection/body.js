import "../../../../styles/admin/addSection/body.css";

const SectionBody = ({ sectionData, handleInputChange, formErrors, index }) => {
    return (
        <div className="addSection-body">
            <div className="addSection-body__form-subgroup">
                <label className="add-section__label">Tên phần học *</label>
                <input
                    className={`add-section__input ${formErrors.tenBai ? 'input-error' : ''}`}
                    type="text"
                    placeholder="Nhập tên phần học"
                    value={sectionData.tenBai || ''}
                    onChange={(e) => handleInputChange(index, 'tenBai', e.target.value)}
                />
            </div>

            <div className="addSection-body__form-subgroup">
                <label className="add-section__label">Nội dung phần học *</label>
                <textarea
                    className={`add-section__textarea ${formErrors.moTa ? 'input-error' : ''}`}
                    placeholder="Nhập mô tả phần học"
                    value={sectionData.moTa || ''}
                    onChange={(e) => handleInputChange(index, 'moTa', e.target.value)}
                />
            </div>
        </div>
    );
};

export default SectionBody;
