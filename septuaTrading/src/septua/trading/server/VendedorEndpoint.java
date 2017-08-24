package septua.trading.server;

import septua.trading.EMF;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JPACursorHelper;

import java.util.List;
import java.util.Random;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.persistence.EntityManager;
import javax.persistence.Query;

@Api(name = "vendedorendpoint", namespace = @ApiNamespace(ownerDomain = "trading.septua", ownerName = "trading.septua", packagePath = "server"))
public class VendedorEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listVendedores")
	public CollectionResponse<Vendedor> listVendedores(@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		EntityManager mgr = null;
		Cursor cursor = null;
		List<Vendedor> execute = null;

		try {
			mgr = getEntityManager();
			Query query = mgr.createQuery("select from Vendedor as Vendedor");
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				query.setHint(JPACursorHelper.CURSOR_HINT, cursor);
			}

			if (limit != null) {
				query.setFirstResult(0);
				query.setMaxResults(limit);
			}

			execute = (List<Vendedor>) query.getResultList();
			cursor = JPACursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (Vendedor obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Vendedor>builder().setItems(execute).setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getVendedor")
	public Vendedor getVendedor(@Named("id") String id) {
		EntityManager mgr = getEntityManager();
		Vendedor vendedor = null;
		try {
			vendedor = mgr.find(Vendedor.class, id);
		} finally {
			mgr.close();
		}
		return vendedor;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param vendedor the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertVendedor")
	public Vendedor insertVendedor(Vendedor vendedor) {
		EntityManager mgr = getEntityManager();
		try {
			if (containsVendedor(vendedor)) {
				throw new EntityExistsException("Object already exists");
			}
			mgr.persist(vendedor);
		} finally {
			mgr.close();
		}
		vendedor.setAccessToken(getSaltString());
		vendedor.setAppToken(getSaltString());
		return vendedor;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param vendedor the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateVendedor")
	public Vendedor updateVendedor(Vendedor vendedor) {
		EntityManager mgr = getEntityManager();
		try {
			if (!containsVendedor(vendedor)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.persist(vendedor);
		} finally {
			mgr.close();
		}
		return vendedor;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeVendedor")
	public void removeVendedor(@Named("id") String id) {
		EntityManager mgr = getEntityManager();
		try {
			Vendedor vendedor = mgr.find(Vendedor.class, id);
			mgr.remove(vendedor);
		} finally {
			mgr.close();
		}
	}

	private boolean containsVendedor(Vendedor vendedor) {
		EntityManager mgr = getEntityManager();
		boolean contains = true;
		try {
			Vendedor item = mgr.find(Vendedor.class, vendedor.getId());
			if (item == null) {
				contains = false;
			}
		} finally {
			mgr.close();
		}
		return contains;
	}

	private static EntityManager getEntityManager() {
		return EMF.get().createEntityManager();
	}
	
	protected String getSaltString() {
        String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();
        while (salt.length() < 9) { // length of the random string.
            int index = (int) (rnd.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }
        String saltStr = salt.toString();
        return saltStr;

	}

}
