package com.Back_CadastroPessoa.repository;

import com.Back_CadastroPessoa.entity.Cadastro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CadastroRepository  extends JpaRepository<Cadastro, Long> {

    public List<Cadastro> findByNome(String nome);

    boolean existsByCpf(String cpf);
    boolean existsByRg(String rg);

}
