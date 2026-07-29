package com.kargo.kargotakip.Exceptions;

import com.kargo.kargotakip.Utils.ResponsePayload;
import com.kargo.kargotakip.Enumerations.ResponseEnum;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.kargo.kargotakip.Controller")
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ResponsePayload<Void>> handleEntityNotFoundException(EntityNotFoundException ex) {
        ResponsePayload<Void> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.NOTFOUND.getHttpStatusCode()); // Dokümandaki NOTFOUND enum'ı
        payload.setSuccess(ResponseEnum.NOTFOUND.getIsSuccess());
        payload.setMessage(ex.getMessage());
        payload.setResponseEnum(ResponseEnum.NOTFOUND);

        return new ResponseEntity<>(payload, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponsePayload<Void>> handleGenericException(Exception ex) {
        ex.printStackTrace();

        ResponsePayload<Void> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.ERROR.getHttpStatusCode());
        payload.setSuccess(ResponseEnum.ERROR.getIsSuccess());
        payload.setMessage("Sistemde beklenmeyen bir hata oluştu.");
        payload.setResponseEnum(ResponseEnum.ERROR);

        return new ResponseEntity<>(payload, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}