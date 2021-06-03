package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.ChinhDemo;
import com.mycompany.myapp.repository.ChinhDemoRepository;
import com.mycompany.myapp.service.ChinhDemoService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ChinhDemo}.
 */
@Service
@Transactional
public class ChinhDemoServiceImpl implements ChinhDemoService {

    private final Logger log = LoggerFactory.getLogger(ChinhDemoServiceImpl.class);

    private final ChinhDemoRepository chinhDemoRepository;

    public ChinhDemoServiceImpl(ChinhDemoRepository chinhDemoRepository) {
        this.chinhDemoRepository = chinhDemoRepository;
    }

    @Override
    public ChinhDemo save(ChinhDemo chinhDemo) {
        log.debug("Request to save ChinhDemo : {}", chinhDemo);
        return chinhDemoRepository.save(chinhDemo);
    }

    @Override
    public Optional<ChinhDemo> partialUpdate(ChinhDemo chinhDemo) {
        log.debug("Request to partially update ChinhDemo : {}", chinhDemo);

        return chinhDemoRepository
            .findById(chinhDemo.getId())
            .map(
                existingChinhDemo -> {
                    if (chinhDemo.getName() != null) {
                        existingChinhDemo.setName(chinhDemo.getName());
                    }

                    return existingChinhDemo;
                }
            )
            .map(chinhDemoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChinhDemo> findAll(Pageable pageable) {
        log.debug("Request to get all ChinhDemos");
        return chinhDemoRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ChinhDemo> findOne(Long id) {
        log.debug("Request to get ChinhDemo : {}", id);
        return chinhDemoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ChinhDemo : {}", id);
        chinhDemoRepository.deleteById(id);
    }
}
