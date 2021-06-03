package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ChinhDemo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ChinhDemo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChinhDemoRepository extends JpaRepository<ChinhDemo, Long> {}
