package com.Back_CadastroPessoa.service;

import com.Back_CadastroPessoa.entity.Cadastro;
import com.Back_CadastroPessoa.repository.CadastroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CadastroService {

    @Autowired
    private CadastroRepository cadastroRepository;

    public String save(Cadastro cadastro) {
        if (cadastro.getId() != null && cadastro.getId() == 0) {
            cadastro.setId(null);
        }

        if (cadastroRepository.existsByCpf(cadastro.getCpf())) {
            throw new RuntimeException("CPF já cadastrado. Por favor, use outro CPF.");
        }

        if (cadastroRepository.existsByRg(cadastro.getRg())) {
            throw new RuntimeException("RG já cadastrado. Por favor, use outro RG.");
        }

             cadastroRepository.save(cadastro);
        return "Cadastro salvo com sucesso!";
    }

    public String update(Cadastro cadastro, long id) {
        if (!cadastroRepository.existsById(id)) {
            throw new IllegalArgumentException("Cadastro não encontrado!");
        }

        Cadastro existente = cadastroRepository.findById(id).get();

        if (!existente.getCpf().equals(cadastro.getCpf())) {
            if (cadastroRepository.existsByCpf(cadastro.getCpf())) {
                throw new RuntimeException("CPF já cadastrado. Por favor, use outro CPF!");
            }
        }

        if (!existente.getRg().equals(cadastro.getRg())) {
            if (cadastroRepository.existsByCpf(cadastro.getRg())) {
                throw new RuntimeException("RG já cadastrado. Por favor, use outro RG!");
            }
        }

        cadastro.setId(id);
        cadastroRepository.save(cadastro);
        return "Cadastro atualizado com sucesso!";
    }

    public String delete(long id) {
        this.cadastroRepository.deleteById(id);
        return " Cadastro deletado com sucesso!";
    }

    public List<Cadastro> listAll() {
        return cadastroRepository.findAll();
    }

    public Cadastro findById(Long id) {
        return cadastroRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cadastro com ID " + id + " não encontrado!"));
    }

    public List<Cadastro> findByNome(String nome) {
        return this.cadastroRepository.findByNome(nome);
    }

}
