package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ChinhDemo;
import com.mycompany.myapp.repository.ChinhDemoRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ChinhDemoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChinhDemoResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/chinh-demos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChinhDemoRepository chinhDemoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChinhDemoMockMvc;

    private ChinhDemo chinhDemo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChinhDemo createEntity(EntityManager em) {
        ChinhDemo chinhDemo = new ChinhDemo().name(DEFAULT_NAME);
        return chinhDemo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChinhDemo createUpdatedEntity(EntityManager em) {
        ChinhDemo chinhDemo = new ChinhDemo().name(UPDATED_NAME);
        return chinhDemo;
    }

    @BeforeEach
    public void initTest() {
        chinhDemo = createEntity(em);
    }

    @Test
    @Transactional
    void createChinhDemo() throws Exception {
        int databaseSizeBeforeCreate = chinhDemoRepository.findAll().size();
        // Create the ChinhDemo
        restChinhDemoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chinhDemo)))
            .andExpect(status().isCreated());

        // Validate the ChinhDemo in the database
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeCreate + 1);
        ChinhDemo testChinhDemo = chinhDemoList.get(chinhDemoList.size() - 1);
        assertThat(testChinhDemo.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createChinhDemoWithExistingId() throws Exception {
        // Create the ChinhDemo with an existing ID
        chinhDemo.setId(1L);

        int databaseSizeBeforeCreate = chinhDemoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChinhDemoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chinhDemo)))
            .andExpect(status().isBadRequest());

        // Validate the ChinhDemo in the database
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = chinhDemoRepository.findAll().size();
        // set the field null
        chinhDemo.setName(null);

        // Create the ChinhDemo, which fails.

        restChinhDemoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chinhDemo)))
            .andExpect(status().isBadRequest());

        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllChinhDemos() throws Exception {
        // Initialize the database
        chinhDemoRepository.saveAndFlush(chinhDemo);

        // Get all the chinhDemoList
        restChinhDemoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chinhDemo.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getChinhDemo() throws Exception {
        // Initialize the database
        chinhDemoRepository.saveAndFlush(chinhDemo);

        // Get the chinhDemo
        restChinhDemoMockMvc
            .perform(get(ENTITY_API_URL_ID, chinhDemo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chinhDemo.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingChinhDemo() throws Exception {
        // Get the chinhDemo
        restChinhDemoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChinhDemo() throws Exception {
        // Initialize the database
        chinhDemoRepository.saveAndFlush(chinhDemo);

        int databaseSizeBeforeUpdate = chinhDemoRepository.findAll().size();

        // Update the chinhDemo
        ChinhDemo updatedChinhDemo = chinhDemoRepository.findById(chinhDemo.getId()).get();
        // Disconnect from session so that the updates on updatedChinhDemo are not directly saved in db
        em.detach(updatedChinhDemo);
        updatedChinhDemo.name(UPDATED_NAME);

        restChinhDemoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChinhDemo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChinhDemo))
            )
            .andExpect(status().isOk());

        // Validate the ChinhDemo in the database
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeUpdate);
        ChinhDemo testChinhDemo = chinhDemoList.get(chinhDemoList.size() - 1);
        assertThat(testChinhDemo.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingChinhDemo() throws Exception {
        int databaseSizeBeforeUpdate = chinhDemoRepository.findAll().size();
        chinhDemo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChinhDemoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chinhDemo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chinhDemo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChinhDemo in the database
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChinhDemo() throws Exception {
        int databaseSizeBeforeUpdate = chinhDemoRepository.findAll().size();
        chinhDemo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChinhDemoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chinhDemo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChinhDemo in the database
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChinhDemo() throws Exception {
        int databaseSizeBeforeUpdate = chinhDemoRepository.findAll().size();
        chinhDemo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChinhDemoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chinhDemo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChinhDemo in the database
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChinhDemoWithPatch() throws Exception {
        // Initialize the database
        chinhDemoRepository.saveAndFlush(chinhDemo);

        int databaseSizeBeforeUpdate = chinhDemoRepository.findAll().size();

        // Update the chinhDemo using partial update
        ChinhDemo partialUpdatedChinhDemo = new ChinhDemo();
        partialUpdatedChinhDemo.setId(chinhDemo.getId());

        restChinhDemoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChinhDemo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChinhDemo))
            )
            .andExpect(status().isOk());

        // Validate the ChinhDemo in the database
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeUpdate);
        ChinhDemo testChinhDemo = chinhDemoList.get(chinhDemoList.size() - 1);
        assertThat(testChinhDemo.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateChinhDemoWithPatch() throws Exception {
        // Initialize the database
        chinhDemoRepository.saveAndFlush(chinhDemo);

        int databaseSizeBeforeUpdate = chinhDemoRepository.findAll().size();

        // Update the chinhDemo using partial update
        ChinhDemo partialUpdatedChinhDemo = new ChinhDemo();
        partialUpdatedChinhDemo.setId(chinhDemo.getId());

        partialUpdatedChinhDemo.name(UPDATED_NAME);

        restChinhDemoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChinhDemo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChinhDemo))
            )
            .andExpect(status().isOk());

        // Validate the ChinhDemo in the database
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeUpdate);
        ChinhDemo testChinhDemo = chinhDemoList.get(chinhDemoList.size() - 1);
        assertThat(testChinhDemo.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingChinhDemo() throws Exception {
        int databaseSizeBeforeUpdate = chinhDemoRepository.findAll().size();
        chinhDemo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChinhDemoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chinhDemo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chinhDemo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChinhDemo in the database
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChinhDemo() throws Exception {
        int databaseSizeBeforeUpdate = chinhDemoRepository.findAll().size();
        chinhDemo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChinhDemoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chinhDemo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChinhDemo in the database
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChinhDemo() throws Exception {
        int databaseSizeBeforeUpdate = chinhDemoRepository.findAll().size();
        chinhDemo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChinhDemoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(chinhDemo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChinhDemo in the database
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChinhDemo() throws Exception {
        // Initialize the database
        chinhDemoRepository.saveAndFlush(chinhDemo);

        int databaseSizeBeforeDelete = chinhDemoRepository.findAll().size();

        // Delete the chinhDemo
        restChinhDemoMockMvc
            .perform(delete(ENTITY_API_URL_ID, chinhDemo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChinhDemo> chinhDemoList = chinhDemoRepository.findAll();
        assertThat(chinhDemoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
