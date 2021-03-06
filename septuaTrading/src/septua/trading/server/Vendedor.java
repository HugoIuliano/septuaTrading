package septua.trading.server;

import javax.persistence.Entity;
import javax.persistence.Id;



@Entity
public class Vendedor {
	
	@Id
	private String id;
	private String appToken;
	private String accessToken;
	private String nome;
	private String descricao;
	private String cpf;
	private String cep;
	private Endereco endereco;
	public String getId() {
		return id;
	}
	public void setId(String id) {
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
	public Endereco getEndereco() {
		return this.endereco; // nao retorna no get
	}
	public void setEndereco(String descricao, String latitude, String longitude) {
		this.endereco = new Endereco(descricao, latitude, longitude);
	}

}

