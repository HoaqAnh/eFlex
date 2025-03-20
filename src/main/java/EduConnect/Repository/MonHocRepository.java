package EduConnect.Repository;

import EduConnect.Domain.MonHoc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MonHocRepository extends JpaRepository<MonHoc, Integer> , JpaSpecificationExecutor<MonHoc> {
    MonHoc findByName(String name);
    MonHoc findById(int id);
    MonHoc save(MonHoc monHoc);
    Page<MonHoc> findAll(Pageable pageable);
}
