package com.github.irmindev.crud.model.request;

public class UserChange {
    private String name;
    private String email;

    public UserChange() {
    }

    public UserChange(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}