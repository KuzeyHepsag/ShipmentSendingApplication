package com.kargo.kargotakip.Enumerations;


import lombok.Getter;
import lombok.Setter;

@Getter
public enum ResponseEnum {
    OK(200, "OK", Boolean.TRUE),
    BADREQUEST(400, "BADREQUEST", Boolean.FALSE),
    UNAUTHORIZED(401, "UNAUTHORIZED", Boolean.FALSE),
    FORBIDDEN(403, "FORBIDDEN", Boolean.FALSE),
    NOTFOUND(404, "NOTFOUND", Boolean.FALSE),
    ERROR(1000, "ERROR", Boolean.FALSE),
    NOTIFICATION(1001, "NOTIFICATION", Boolean.FALSE),
    INFO(1002, "INFO", Boolean.TRUE),
    WARNING(100, "WARNING", Boolean.TRUE);

    private final Integer httpStatusCode;
    private final String description;
    private final Boolean isSuccess;

    ResponseEnum(Integer httpStatusCode, String description, Boolean isSuccess) {
        this.httpStatusCode = httpStatusCode;
        this.description = description;
        this.isSuccess = isSuccess;
    }
}
