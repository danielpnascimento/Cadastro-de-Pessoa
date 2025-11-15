package com.Back_CadastroPessoa.repository;

import com.Back_CadastroPessoa.entity.Cadastro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CadastroRepository  extends JpaRepository<Cadastro, Long> {

    public List<Cadastro> findByNome(String nome);

    // NOVIDADE: VERIFICA SE CPF JÁ EXISTE
    boolean existsByCpf(String cpf);

}
