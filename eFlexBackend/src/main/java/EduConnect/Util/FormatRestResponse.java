package EduConnect.Util;

import EduConnect.Domain.Response.RestResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter methodParameter, Class<? extends HttpMessageConverter<?>> aClass) {
        return true;
    }
    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response)
    {
        HttpServletResponse httpResponse = ((ServletServerHttpResponse) response).getServletResponse();
        int status = httpResponse.getStatus();

        if(body instanceof String) {
            return body;
        }
        RestResponse<Object> restResponse = new RestResponse<>();
        restResponse.setStatusCode(status);
        if(status >= 400) {
            //case error
            return body;
        }
        //case success
        else {
            restResponse.setData(body);
            ApiMessage message=returnType.getMethodAnnotation(ApiMessage.class);
            restResponse.setMessage(message!=null ? message.value():"Call API SUCCESS");


        }
        return restResponse;
    }
}