package com.Back_CadastroPessoa.controller;

import com.Back_CadastroPessoa.entity.Cadastro;
import com.Back_CadastroPessoa.service.CadastroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/cadastro")
@CrossOrigin("*") // Quando for para produção seta o ip do front ex.(origins = "http://localhost:4200")
public class CadastroController {

    // Anotação do autowired do spring para não usar o new de instanciação
    // onde a service manda para controller que recebe e envia!
    @Autowired
    private CadastroService cadastroService;

    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody Cadastro cadastro) {
        System.out.println("Foto recebida (raw): " + cadastro.getFoto());
        System.out.println("Tamanho da foto (caracteres): " + (cadastro.getFoto() != null ? cadastro.getFoto().length() : 0));
        try {
            // pra logar o objeto completo.
            System.out.println("JSON recebido: " + cadastro);
            // Logar o valor recebido para foto
            System.out.println("Foto recebida (raw): " + cadastro.getFoto());
            // Loga a foto e seu tamanho
            System.out.println("Foto recebida (raw): " + cadastro.getFoto());
            System.out.println("Tamanho da foto (caracteres): " + (cadastro.getFoto() != null ? cadastro.getFoto().length() : 0));
            // Valida e limpa a string Base64 da foto
            if (cadastro.getFoto() != null && !cadastro.getFoto().isEmpty()) {
                String base64String = cadastro.getFoto().replaceAll("\\s+", "");
                try {
                    Base64.getDecoder().decode(base64String); // Valida Base64
                    cadastro.setFoto(base64String);
                } catch (IllegalArgumentException e) {
                    System.out.println("Erro ao decodificar Base64: " + e.getMessage());
                    return new ResponseEntity<>("Erro: Formato de foto inválido. Deve ser uma string Base64 válida.", HttpStatus.BAD_REQUEST);
                }
            } else {
                cadastro.setFoto(null); // Garante que foto seja null se não for enviada
            }
            // msg de ok Salva o cadastro e msg de erro
            String mensagem = this.cadastroService.save(cadastro);
            // método ok faz parte do create
            return new ResponseEntity<>(mensagem, HttpStatus.OK);
            // Trata CPF duplicado
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            if (e.getMessage().contains("Duplicate entry")) {
                return new ResponseEntity<>("Erro: CPF já cadastrado.", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("Erro ao salvar: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace(); // Loga o erro completo no console do backend
            return new ResponseEntity<>("Erro ao salvar: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody Cadastro cadastro) {
        if (cadastro.getFoto() != null && !cadastro.getFoto().matches("^[A-Za-z0-9+/=]+$")) {
            return ResponseEntity.badRequest().body("Formato de foto inválido. Deve ser uma string Base64 válida.");
        }
        try {
            System.out.println("JSON recebido: " + cadastro);
            System.out.println("Foto recebida (raw): " + cadastro.getFoto());
            // if para a conversão Base64 para a foto byte[]
            if (cadastro.getFoto() != null && !cadastro.getFoto().isEmpty()) {
                try {
                    String base64String = cadastro.getFoto().replaceAll("\\s+", "");
                    Base64.getDecoder().decode(base64String);
                    cadastro.setFoto(base64String);
                } catch (IllegalArgumentException e) {
                    System.out.println("Erro ao decodificar Base64: " + e.getMessage());
                    throw new IllegalArgumentException("Formato de foto inválido. Deve ser uma string Base64 válida.");
                }
            } else {
                cadastro.setFoto(null); // Garante que foto seja null se não for enviada
            }
            cadastro.setId(id);
            String mensagem = this.cadastroService.update(cadastro, id);
            return new ResponseEntity<>(mensagem, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Loga o erro completo no console do backend
            return new ResponseEntity<>("Erro ao atualizar: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable long id) {
        try {
            String mensagem = this.cadastroService.delete(id);
            return new ResponseEntity<>(mensagem, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Erro ao deletar: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/listAll")
    public ResponseEntity<List<Cadastro>> listAll() {
        try {
            System.out.println("Requisição recebida para /api/cadastro/listAll");
            List<Cadastro> lista = this.cadastroService.listAll();
            return new ResponseEntity<>(lista, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Cadastro> findById(@PathVariable long id) {
        try {
            Cadastro cadastro = this.cadastroService.findById(id);
            return new ResponseEntity<>(cadastro, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/findByNome")
    // Usando um Parâmetro para busca no postman
    public ResponseEntity<List<Cadastro>> findByNome(@RequestParam String nome) {
        try {
            List<Cadastro> lista = this.cadastroService.findByNome(nome);
            return new ResponseEntity<>(lista, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}

