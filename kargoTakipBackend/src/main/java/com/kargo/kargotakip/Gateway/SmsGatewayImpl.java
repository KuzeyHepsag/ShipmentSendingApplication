package com.kargo.kargotakip.Gateway;

import com.kargo.kargotakip.Gateway.SmsGateway;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
@Primary
public class SmsGatewayImpl implements SmsGateway {

    @Override
    public void sendSms(String phoneNumber, String message) {
        System.out.println("**************************************************");
        System.out.println("✅ SMS SİMÜLASYONU TETİKLENDİ!");
        System.out.println("Alıcı: " + phoneNumber);
        System.out.println("Mesaj İçeriği: " + message);
        System.out.println("Sistem SMS gönderme görevini başarıyla tamamladı.");
        System.out.println("**************************************************");
    }
}