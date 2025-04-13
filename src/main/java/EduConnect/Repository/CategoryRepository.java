package EduConnect.Repository;

import EduConnect.Domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByNameCategory(String name);
    void deleteById(Long id);
}
