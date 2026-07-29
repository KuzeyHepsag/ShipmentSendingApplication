package com.kargo.kargotakip.Controller;


import com.kargo.kargotakip.Dto.LoginRequest;
import com.kargo.kargotakip.Dto.RegisterRequest;
import com.kargo.kargotakip.Entity.Customer;
import com.kargo.kargotakip.Entity.User;
import com.kargo.kargotakip.Entity.Warehouse;
import com.kargo.kargotakip.Repository.CustomerRepository;
import com.kargo.kargotakip.Repository.UserRepository;
import com.kargo.kargotakip.Repository.WarehouseRepository;
import com.kargo.kargotakip.Service.WarehouseService;
import com.kargo.kargotakip.Utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private WarehouseRepository warehouseRepository;
    @Autowired
    private WarehouseService warehouseService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Hatalı şifre!");
        }
        String token = jwtUtils.generateToken(user.getUsername(), user.getRole());
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Kayıt esnasında hata oluştu.");
        }
        Iterable<Customer> customers = customerRepository.findAll();
        for (Customer customer : customers){
            if (customer.getPhone().equals(request.getPhone())){
                return ResponseEntity.badRequest().body("Bu telefon numarasına ait üyelik zaten mevcut.");
            }
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");

        Customer customer = new Customer();
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());

        // YENİ EKLENENLER: Müşterinin gönderdiği lokasyon bilgilerini ata
        customer.setLatitude(request.getLatitude());
        customer.setLongitude(request.getLongitude());
        customer.setAddress(request.getAddress());

        if (customer.getLatitude() != null && customer.getLongitude() != null) {
            Iterable<Warehouse> warehouses = warehouseRepository.findAll();
            Warehouse closest = null;
            double minDistance = Double.MAX_VALUE;

            for (Warehouse warehouse : warehouses) {
                if (warehouse.getLatitude() != null && warehouse.getLongitude() != null) {
                    double distance = warehouseService.getRealDrivingDistance(
                            customer.getLatitude(), customer.getLongitude(),
                            warehouse.getLatitude(), warehouse.getLongitude()
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        closest = warehouse;
                    }
                }
            }
            // Hesaplanan en yakın depoyu müşteriye zimmetle
            customer.setClosestWarehouse(closest);
        }

        user.setCustomer(customer);
        customerRepository.save(customer);
        userRepository.save(user);

        return ResponseEntity.ok("Kayıt Başarılı!");
    }
}
