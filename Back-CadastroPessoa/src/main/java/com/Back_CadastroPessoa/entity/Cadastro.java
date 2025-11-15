package com.Back_CadastroPessoa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

//@AllArgsConstructor
//@NoArgsConstructor
//@Getter
//@Setter

//Desativei o lombok para confirmar tudo

@Entity
@Table(name = "cadastro")
public class Cadastro implements Serializable {

    @Id
    // GenerationType.IDENTITY deixa o banco gerar o valor automaticamente
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @Column(length = 100000) // Ajuste o tamanho conforme necessário
    // private String foto; modo errado
    // private byte[] foto; //(para Data URL) ou byte[] (para BLOB).
    // Armazenar Base64 como texto longo (LONGTEXT) é ideal pró H2 e compatível com MySQL, evitando erro de tamanho.
    @Column(columnDefinition = "LONGTEXT")
    private String foto; // Alterado de byte[] para String de volta
    // Cada campo tem @Column(nullable = false) — o que força o banco a exigir preenchimento.
    @Column(nullable = false)
    private String nome;

    // unique = true no CPF, garantindo unicidade na tabela.
    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String rg;

    @Column(nullable = false)
    private String uf;

    @Column(nullable = false)
    private String pais;

    @Column(nullable = false)
    private String nascimento; // Mantenha como String se o frontend envia DD/MM/YYYY

    @Column(nullable = false)
    private String sexo;

    @Column(nullable = false)
    private String civil;

    @Column(nullable = false)
    private String escolaridade;

    @Column(nullable = false)
    private String profissao;

    @Column(nullable = false)
    private String telefone;

    @Column(nullable = false)
    private String telefoneRec;

    @Column(nullable = false)
    private String nomepai;

    @Column(nullable = false)
    private String nomemae;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String cep;

    @Column(nullable = false)
    private String rua;

    @Column(nullable = false)
    private String bairro;

    @Column(nullable = false)
    // Mantido como int, sem Integer, o que faz sentido se o campo nunca for nulo.
    private int numero;

    @Column(nullable = false)
    private String cidades;

    @Column(nullable = false)
    private String estados;

    @Column(nullable = false)
    private String complemento;

    @Column(columnDefinition = "TEXT")
    private String textarea;

    // Construtores
    public Cadastro() {
    }

    public Cadastro(Long id, String foto, String nome, String cpf, String rg, String uf, String pais,
                    String nascimento, String sexo, String civil, String escolaridade, String profissao,
                    String telefone, String telefoneRec, String nomepai, String nomemae, String email,
                    String cep, String rua, String bairro, int numero, String cidades, String estados,
                    String complemento, String textarea) {
        this.id = id;
        this.foto = foto;
        this.nome = nome;
        this.cpf = cpf;
        this.rg = rg;
        this.uf = uf;
        this.pais = pais;
        this.nascimento = nascimento;
        this.sexo = sexo;
        this.civil = civil;
        this.escolaridade = escolaridade;
        this.profissao = profissao;
        this.telefone = telefone;
        this.telefoneRec = telefoneRec;
        this.nomepai = nomepai;
        this.nomemae = nomemae;
        this.email = email;
        this.cep = cep;
        this.rua = rua;
        this.bairro = bairro;
        this.numero = numero;
        this.cidades = cidades;
        this.estados = estados;
        this.complemento = complemento;
        this.textarea = textarea;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getNascimento() {
        return nascimento;
    }

    public void setNascimento(String nascimento) {
        this.nascimento = nascimento;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public String getCivil() {
        return civil;
    }

    public void setCivil(String civil) {
        this.civil = civil;
    }

    public String getEscolaridade() {
        return escolaridade;
    }

    public void setEscolaridade(String escolaridade) {
        this.escolaridade = escolaridade;
    }

    public String getProfissao() {
        return profissao;
    }

    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getTelefoneRec() {
        return telefoneRec;
    }

    public void setTelefoneRec(String telefoneRec) {
        this.telefoneRec = telefoneRec;
    }

    public String getNomepai() {
        return nomepai;
    }

    public void setNomepai(String nomepai) {
        this.nomepai = nomepai;
    }

    public String getNomemae() {
        return nomemae;
    }

    public void setNomemae(String nomemae) {
        this.nomemae = nomemae;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getRua() {
        return rua;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public String getCidades() {
        return cidades;
    }

    public void setCidades(String cidades) {
        this.cidades = cidades;
    }

    public String getEstados() {
        return estados;
    }

    public void setEstados(String estados) {
        this.estados = estados;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getTextarea() {
        return textarea;
    }

    public void setTextarea(String textarea) {
        this.textarea = textarea;
    }

    @Override
    public String toString() {
        return "Cadastro{" +
                "id=" + id +
                ", foto='" + (foto != null ? "present" : "null") + '\'' +
                ", nome='" + nome + '\'' +
                ", cpf='" + cpf + '\'' +
                ", rg='" + rg + '\'' +
                ", uf='" + uf + '\'' +
                ", pais='" + pais + '\'' +
                ", nascimento='" + nascimento + '\'' +
                ", sexo='" + sexo + '\'' +
                ", civil='" + civil + '\'' +
                ", escolaridade='" + escolaridade + '\'' +
                ", profissao='" + profissao + '\'' +
                ", telefone='" + telefone + '\'' +
                ", telefoneRec='" + telefoneRec + '\'' +
                ", nomepai='" + nomepai + '\'' +
                ", nomemae='" + nomemae + '\'' +
                ", email='" + email + '\'' +
                ", cep='" + cep + '\'' +
                ", rua='" + rua + '\'' +
                ", bairro='" + bairro + '\'' +
                ", numero=" + numero +
                ", cidades='" + cidades + '\'' +
                ", estados='" + estados + '\'' +
                ", complemento='" + complemento + '\'' +
                ", textarea='" + textarea + '\'' +
                '}';
    }
}
