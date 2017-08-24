package septua.trading.server;

import javax.persistence.Entity;
import javax.persistence.Id;



@Entity
public class Vendedor {
	
	@Id
	private Integer id;
	private String appToken;
	private String accessToken;
	private String nome;
	private String descricao;
	private String cpf;
	private String cep;
	private String endereco;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getAppToken() {
		return appToken;
	}
	public void setAppToken(String appToken) {
		this.appToken = appToken;
	}
	public String getAccessToken() {
		return accessToken;
	}
	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	public String getCpf() {
		return cpf;
	}
	public void setCpf(String cpf) {
		this.cpf = cpf;
	}
	public String getCep() {
		return cep;
	}
	public void setCep(String cep) {
		this.cep = cep;
	}
	public String getEndereco() {
		return endereco;
	}
	public void setEndereco(String endereco) {
		this.endereco = endereco;
	}
	public String getEndereco_lat() {
		return endereco_lat;
	}
	public void setEndereco_lat(String endereco_lat) {
		this.endereco_lat = endereco_lat;
	}
	public String getEndereco_long() {
		return endereco_long;
	}
	public void setEndereco_long(String endereco_long) {
		this.endereco_long = endereco_long;
	}
	private String endereco_lat;
	private String endereco_long;
}
