package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.ChinhDemo;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ChinhDemo}.
 */
public interface ChinhDemoService {
    /**
     * Save a chinhDemo.
     *
     * @param chinhDemo the entity to save.
     * @return the persisted entity.
     */
    ChinhDemo save(ChinhDemo chinhDemo);

    /**
     * Partially updates a chinhDemo.
     *
     * @param chinhDemo the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ChinhDemo> partialUpdate(ChinhDemo chinhDemo);

    /**
     * Get all the chinhDemos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ChinhDemo> findAll(Pageable pageable);

    /**
     * Get the "id" chinhDemo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ChinhDemo> findOne(Long id);

    /**
     * Delete the "id" chinhDemo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
