package com.kargo.kargotakip.Gateway;

public interface SmsGateway {
    void sendSms(String phoneNumber,String message);
}
