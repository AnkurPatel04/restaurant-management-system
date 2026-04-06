package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.io.TableRequest;
import com.example.Full_Stack_Food_Delivery_App.io.TableResponse;

import java.util.List;

public interface TableService {

    TableResponse addTable(TableRequest request);

    List<TableResponse> getAllTables(String restaurantId);
    List<TableResponse> getAvailableTables(String restaurantId,String date, String time,int guests);


    TableResponse updateTable(String id, TableRequest request);

    void deleteTable(String id);
    TableResponse occupyTable(String restaurantId,int tableNumber);


}