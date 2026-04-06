package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.entity.CartEntity;
import com.example.Full_Stack_Food_Delivery_App.entity.UserEntity;
import com.example.Full_Stack_Food_Delivery_App.io.CartRequest;
import com.example.Full_Stack_Food_Delivery_App.io.CartResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.CartRepository;
import com.example.Full_Stack_Food_Delivery_App.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    // Get email from JWT
    private String getCurrentUserEmail(){
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    // Convert email → userId
    private String findUserId(){
        String email = getCurrentUserEmail();

        UserEntity loggedInUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found in cart"));

        return loggedInUser.getId();
    }

    // ADD TO CART
    @Override
    public CartResponse addTocart(CartRequest request) {

        String userId = findUserId();

        Optional<CartEntity> cartOptional =
                cartRepository.findByUserIdAndRestaurantId(userId, request.getRestaurantId());

        CartEntity cart = cartOptional.orElseGet(() ->
                CartEntity.builder()
                        .userId(userId)
                        .restaurantId(request.getRestaurantId())
                        .tableNo(request.getTableNo())
                        .items(new HashMap<>())
                        .build()
        );

        Map<String, Integer> cartItems = cart.getItems();

        cartItems.put(
                request.getFoodId(),
                cartItems.getOrDefault(request.getFoodId(), 0) + 1
        );

        cart.setItems(cartItems);

        if (cart.getTableNo() == null) {
            cart.setTableNo(request.getTableNo());
        }

        cart = cartRepository.save(cart);

        return convertToResponse(cart);
    }

    // GET CART
    @Override
    public CartResponse getCart(String restaurantId) {

        String userId = findUserId();

        CartEntity cart = cartRepository
                .findByUserIdAndRestaurantId(userId, restaurantId)
                .orElse(
                        CartEntity.builder()
                                .userId(userId)
                                .restaurantId(restaurantId)
                                .items(new HashMap<>())
                                .build()
                );

        return convertToResponse(cart);
    }

    // CLEAR CART
    @Override
    public void clearCart(String restaurantId) {

        String userId = findUserId();

        cartRepository.deleteByUserIdAndRestaurantId(userId, restaurantId);
    }

    // REMOVE ONE ITEM
    @Override
    public CartResponse removeFromCart(CartRequest request) {

        String userId = findUserId();

        CartEntity cart = cartRepository
                .findByUserIdAndRestaurantId(userId, request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Map<String, Integer> cartItems = cart.getItems();

        if (cartItems.containsKey(request.getFoodId())) {

            int qty = cartItems.get(request.getFoodId());

            if (qty > 1) {
                cartItems.put(request.getFoodId(), qty - 1);
            } else {
                cartItems.remove(request.getFoodId());
            }
        }

        cart.setItems(cartItems);

        cart = cartRepository.save(cart);

        return convertToResponse(cart);
    }

    // REMOVE ALL OF ONE FOOD
    @Override
    public CartResponse removeAllFromCart(CartRequest request) {

        String userId = findUserId();

        CartEntity cart = cartRepository
                .findByUserIdAndRestaurantId(userId, request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Map<String, Integer> cartItems = cart.getItems();

        cartItems.remove(request.getFoodId());

        cart.setItems(cartItems);

        cart = cartRepository.save(cart);

        return convertToResponse(cart);
    }

    // CLEAR TABLE NUMBER
    @Override
    public void clearTableNo(String restaurantId) {

        String userId = findUserId();

        CartEntity cart = cartRepository
                .findByUserIdAndRestaurantId(userId, restaurantId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.setTableNo(null);

        cartRepository.save(cart);
    }

    // CONVERT ENTITY → RESPONSE
    private CartResponse convertToResponse(CartEntity cart) {

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .restaurantId(cart.getRestaurantId())
                .tableNo(cart.getTableNo())
                .items(cart.getItems())
                .build();
    }
}

















//
//@Service
//@AllArgsConstructor
//public class CartServiceImpl implements CartService{
//
//    private final UserRepository userRepository;
//    private final CartRepository cartRepository;
//
//    //Utility method to get logged-in user identity from JWT
////    👉 Extracts email from JWT
////    Because JWT sub = email
//    private String getCurrentUserId(){
//        return SecurityContextHolder.getContext()
//                .getAuthentication()
//                .getName();
//    }
//    private String findUserId(){
//        String userId = getCurrentUserId();
//       UserEntity LoggedInUser= userRepository.findByEmail(userId).orElseThrow(()->new UsernameNotFoundException("user name not fount in cart"));
//       return LoggedInUser.getId();
//    }
//
//
//
//    @Override
//    public CartResponse addTocart(CartRequest request) {
//        String loggedInUserId = findUserId();
//        Optional<CartEntity> cartOptional = cartRepository.findByUserId(loggedInUserId);
//
////
////        ✅ Case 1: Cart exists
////        cart = cartOptional.get();
////
////        ❌ Case 2: Cart does not exist
////        cart = new CartEntity(loggedInUserId, new HashMap<>());
//
//
//        CartEntity cart= cartOptional.orElseGet(()-> new CartEntity(loggedInUserId,new HashMap<>()));
////        CartEntity cart;
////        if (cartOptional.isPresent()) {
////            cart = cartOptional.get();
////        } else {
////            cart = new CartEntity(loggedInUserId, new HashMap<>());
////        }
//
//
//        Map<String,Integer> cartItem = cart.getItems();
//
//
//        cartItem.put(request.getFoodId(),cartItem.getOrDefault(request.getFoodId(),0) + 1);//0+1,,7+1
//        //old
////        if (cartItem.containsKey(foodId)) {
////            int qty = cartItem.get(foodId);
////            cartItem.put(foodId, qty + 1);
////        } else {
////            cartItem.put(foodId, 1);
////        }
//
//        cart.setItems(cartItem);
//        // ✅ Store table number only if not already set
//        if (cart.getTableNo() == null) {
//            cart.setTableNo(request.getTableNo());
//        }
//
//
//        cart=cartRepository.save(cart);
//
//        return convertTOresponse(cart);
//
//
//    }
//
//    @Override
//    public CartResponse getCart() {
//        String loggedInUserId = findUserId();
//        CartEntity entity = cartRepository.findByUserId(loggedInUserId).orElse(new CartEntity(null,loggedInUserId,null,new HashMap<>()));
//        return convertTOresponse(entity);
//    }
//
//    @Override
//    public void clearCart() {
//        String loggedInUserId = findUserId();
//        cartRepository.deleteByUserId(loggedInUserId);
//
//    }
//
//    @Override
//    public CartResponse removeFromCart(CartRequest request) {
//        String loggedInUserId = findUserId();
//        CartEntity entity = cartRepository.findByUserId(loggedInUserId).orElseThrow(()->new RuntimeException("cart not found in removeFromCart"));
//        Map<String,Integer> cartItems = entity.getItems(); //It gives you a reference to the same map stored inside entity.//cartItems  ───► same Map object ◄─── entity.items
//
//        if(cartItems.containsKey(request.getFoodId())) {
//
//
//            int currentQty = cartItems.get(request.getFoodId());
//
//            if (currentQty > 0) {
//                cartItems.put(request.getFoodId(), currentQty - 1);
//            } else {
//                cartItems.remove(request.getFoodId());
//            }
//
//        entity.setItems(cartItems);//no need to write this line
//        entity = cartRepository.save(entity);
//        }
//
//        return convertTOresponse(entity);
//
//    }
//
//    @Override
//    public CartResponse removeAllFromCart(CartRequest request) {
//        String loggedInUserId = findUserId();
//        CartEntity entity = cartRepository.findByUserId(loggedInUserId).orElseThrow(()->new RuntimeException("cart not found in removeAllFromCart"));
//        Map<String,Integer> cartItems = entity.getItems(); //It gives you a reference to the same map stored inside entity.//cartItems  ───► same Map object ◄─── entity.items
//
//        if(cartItems.containsKey(request.getFoodId())) {
//                cartItems.remove(request.getFoodId());
//
//            entity.setItems(cartItems);//no need to write this line
//            entity = cartRepository.save(entity);
//        }
//        return convertTOresponse(entity);
//    }
//
//    @Override
//    public void clearTableNo() {
//        String userId = findUserId();
//        CartEntity cart = cartRepository.findByUserId(userId)
//                .orElseThrow(() -> new RuntimeException("Cart not found in clearTableNo"));
//        cart.setTableNo(null);
//        cartRepository.save(cart);
//    }
//
//    private CartResponse convertTOresponse(CartEntity cartEntity){
//        return CartResponse.builder().id(cartEntity.getId())
//                .userId(cartEntity.getUserId())
//                .tableNo(cartEntity.getTableNo())
//                .items(cartEntity.getItems())
//                .build();
//
//    }
//
//}
