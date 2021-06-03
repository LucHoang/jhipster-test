package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChinhDemoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChinhDemo.class);
        ChinhDemo chinhDemo1 = new ChinhDemo();
        chinhDemo1.setId(1L);
        ChinhDemo chinhDemo2 = new ChinhDemo();
        chinhDemo2.setId(chinhDemo1.getId());
        assertThat(chinhDemo1).isEqualTo(chinhDemo2);
        chinhDemo2.setId(2L);
        assertThat(chinhDemo1).isNotEqualTo(chinhDemo2);
        chinhDemo1.setId(null);
        assertThat(chinhDemo1).isNotEqualTo(chinhDemo2);
    }
}
