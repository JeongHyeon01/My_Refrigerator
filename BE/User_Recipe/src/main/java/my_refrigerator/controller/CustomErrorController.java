package my_refrigerator.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        return "에러가 발생했습니다. API 엔드포인트를 확인해주세요.";
    }
} 