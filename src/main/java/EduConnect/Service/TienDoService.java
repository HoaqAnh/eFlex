package EduConnect.Service;

import EduConnect.Domain.TienDo;
import EduConnect.Repository.TienDoRepository;
import org.springframework.stereotype.Service;

@Service
public class TienDoService {
    private TienDoRepository tienDoRepository;
    public TienDoService(TienDoRepository tienDoRepository) {
        this.tienDoRepository = tienDoRepository;
    }
    public TienDo save(TienDo tienDo) {
        return tienDoRepository.save(tienDo);
    }
    public void delete(TienDo tienDo) {
        tienDoRepository.delete(tienDo);
    }
    public void deleteTienDoByCourseId(long courseId){

    }
}
