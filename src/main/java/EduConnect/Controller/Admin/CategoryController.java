package EduConnect.Controller.Admin;

import EduConnect.Domain.Category;
import EduConnect.Service.CategoryService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.Error.IdInValidException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CategoryController {

    private final CategoryService categoryService;
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/Category")
    @ApiMessage("All Category")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        if (categories.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/Category")
    @ApiMessage("Add a Category")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) throws IdInValidException {
        if (categoryService.findCategoryByNameCategory(category.getNameCategory()) != null) {
            throw new IdInValidException("Category " + category.getNameCategory() + "already exists");
        }
        Category newCategory = categoryService.addCategory(category);
        return ResponseEntity.status(HttpStatus.OK).body(newCategory);
    }


    @PutMapping("Category/{id}")
    @ApiMessage("Update Category")
    public ResponseEntity<Category> updateCategory(@PathVariable("id") Long id,
                                                   @RequestBody Category category) throws IdInValidException {
        Category updateCategory = categoryService.findCategoryById(id);
        if (updateCategory == null) {
            throw new IdInValidException("Category Id: " + id + "does not exist");
        }
        updateCategory.setNameCategory(category.getNameCategory());
        categoryService.updateCategory(updateCategory);
        return ResponseEntity.status(HttpStatus.OK).body(updateCategory);
    }
}
