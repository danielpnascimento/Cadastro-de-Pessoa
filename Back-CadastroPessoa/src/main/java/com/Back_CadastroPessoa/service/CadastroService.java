package com.Back_CadastroPessoa.service;

import com.Back_CadastroPessoa.entity.Cadastro;
import com.Back_CadastroPessoa.repository.CadastroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CadastroService {
    // Chamando e instanciando na repository para registro no banco
    @Autowired
    private CadastroRepository cadastroRepository;

    public String save(Cadastro cadastro) {
        if (cadastro.getId() != null && cadastro.getId() == 0) {
            cadastro.setId(null); // Garante que id=0 seja tratado como novo cadastro
        }
        // VALIDA CPF PARA NOVO CADASTRO
        if (cadastroRepository.existsByCpf(cadastro.getCpf())) {
            throw new RuntimeException("CPF já cadastrado. Por favor, use outro CPF.");
        }
        // Chamando repository para instanciar no banco
        cadastroRepository.save(cadastro);
        // return cadastro.getNome() + " - Cadastro salvo com sucesso!";
        return "Cadastro salvo com sucesso!";
    }

    public String update(Cadastro cadastro, long id) {
        if (!cadastroRepository.existsById(id)) {
            // throw new IllegalArgumentException("Cadastro com ID " + id + " não encontrado!");
            throw new IllegalArgumentException("Cadastro não encontrado!");
        }
           // NOVIDADE: VERIFICA SE O CPF É DO PRÓPRIO CADASTRO
        Cadastro existente = cadastroRepository.findById(id).get();
        // VALIDA CPF SÓ SE MUDOU
        if (!existente.getCpf().equals(cadastro.getCpf())) {
            if (cadastroRepository.existsByCpf(cadastro.getCpf())) {
                throw new RuntimeException("CPF já cadastrado. Por favor, use outro CPF!");
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

    // Criação de filtro customizados "nome" Consultas JPQL
    public List<Cadastro> findByNome(String nome) {
        return this.cadastroRepository.findByNome(nome);
    }

}
