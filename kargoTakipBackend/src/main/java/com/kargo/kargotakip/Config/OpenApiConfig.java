package com.kargo.kargotakip.Config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI(){
        return new OpenAPI()
                .info(new Info()
                        .title("Kargo Takip Sistemi API")
                        .version("1.0.0")
                        .description("Kurumsal Kargo Takip ve Yönetim Sistemi API Dokümentasyonu")
                        .contact(new Contact()
                                .name("Geliştirici Ekip")
                                .email("info@kargotakip.com")));
    }
}
