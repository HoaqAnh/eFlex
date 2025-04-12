package EduConnect.Service;

import EduConnect.Domain.Category;
import EduConnect.Repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    public Category addCategory(Category category) {
        return this.categoryRepository.save(category);
    }
    public Category findCategoryByNameCategory(String name) {
        return categoryRepository.findByNameCategory(name);
    }
    public void deleteCategory(Category category) {
        categoryRepository.delete(category);
    }
    public Category findCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }
    public Category updateCategory(Category category) {
        return this.categoryRepository.save(category);
    }
}
