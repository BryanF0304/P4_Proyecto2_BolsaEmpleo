package com.una.bolsaempleo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // SPA: cualquier ruta no-API cae en index.html
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}