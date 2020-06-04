package com.example.application.backend;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Employee {
    private static long id_tracker = 42L; 

    @JsonIgnore
    private Long id;

    private String idString;

    //@NotEmpty
    //@Size(max=10, message = "Name should be less than 10 charactors")
    private String firstname;
    //@NotEmpty
    //@Size(max=10, message = "Name should be less than 10 charactors")
    private String lastname;
    private String title;
    //@NotEmpty
    private String email;
    private String notes = "";
    private int age = 25;

    public Employee(String firstname, String lastname, String email, String title) {
        super();
        this.id = id_tracker++;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.title = title;
    }

    public Employee() {

    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return firstname + " " + lastname + "(" + email + ")";
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    /**
     * When transmitting ID to the client we need a data type that is supported
     * (long is not supported in JavaScript)
     *
     * @return String representation if {@link #id}
     */
    public String getIdString() {
        return id == null ? null : id.toString();
    }

    public void setIdString(String idString) {
        try{
            this.id = Long.parseLong(idString);
        }catch(Exception e){
            this.id = Employee.id_tracker++;
        }
    }

    

    @Override
    public int hashCode() {
        if (id == null) {
            return super.hashCode();
        } else {
            return id.intValue();
        }
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null || id == null) {
            return false;
        }
        if (!(obj instanceof Employee)) {
            return false;
        }

        if (id.equals(((Employee) obj).id)) {
            return true;
        }
        return false;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
