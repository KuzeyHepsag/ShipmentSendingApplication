package com.kargo.kargotakip.Utils;


import com.kargo.kargotakip.Enumerations.ResponseEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponsePayload<T> {
    private Integer code;
    private String message;
    private Boolean success;
    private ResponseEnum responseEnum;
    private Boolean showNotification=false;
    private T data;
}
