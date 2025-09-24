package com.contele.api.contele_forms_api.modelo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Tarefa {
    private String id;
    private String creatorId;
    private String clientId;
    private String userId;
    private String poiId;
    private String datetime;
    private boolean withTime;
    private String observation;
    private String status;
    private boolean read;
    private boolean received;
    private boolean rescheduled;
    private String origin;
    private String os;
    private String sequence;
    private String order;
    private Poi poi;
    
    @JsonProperty("userData")
    private UserData usuario;
    @JsonProperty("creatorData")
    private CreatorData criador;
    private String originalDate;
    private String createdAt;
    private String updatedAt;
    private boolean formsAnsweredFarFormPoi;
    private String creatorName;
    private String date;
    private boolean hasForms;
    private String recurrenceId;
    private List<Object> forms;
    private String checkinTime;
    private String checkoutTime;
    private String comments;
    private String poiId2;
    private String recurrence;
    private String timezone;
    private String userName;
    private String userMail;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Poi {
        private String id;
        private String name;
        private String obs;
        private String corporateName;
        private String cnpj_cpf;
        private Address address;
        private List<Contact> contacts;
        private double lat;
        private double lng;
        private String locationReliability;
        private String searchTerm;
        private String search_term;
        private String fullTextSearchTerm;
        private String status;
        private String origin;
        private String clientId;
        private String creatorId;
        private String creatorName;
        private String createdAt;
        private String updatedAt;
        private Object data;
        private String categoryId;
        private String importId;
        private String localId;
        private String positionedByCheckin;
        private String customId;
        private String categoryName;
        private String categoryColor;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class UserData {
        private String id;
        private String clientId;
        private String name;
        private String username;
        private String email;
        private Address address;
        private String coefficient;
        private String role;
        private String phoneNumber;
        private String status;
        private String type;
        private List<Object> subordinates;
        private String createdAt;
        private String updatedAt;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CreatorData {
        private String id;
        private String name;
        private String username;
        private String email;
        private String type;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Address {
        private Location location;
        private String neighborhood;
        private String zipcode;
        private String city;
        private String complement;
        private String name;
        private String number;
        private String state;
        private String simpleName;
        private String nameBackup;
        private String street;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Location {
        private double latitude;
        private double longitude;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Contact {
        private String name;
        private String email;
        private String phone;
    }
}
