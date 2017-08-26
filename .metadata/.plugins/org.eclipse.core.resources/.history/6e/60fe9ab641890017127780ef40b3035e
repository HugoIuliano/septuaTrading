package com.septua.api.server;

import com.septua.api.EMF;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JPACursorHelper;

import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.persistence.EntityManager;
import javax.persistence.Query;

@Api(name = "entregaendpoint", namespace = @ApiNamespace(ownerDomain = "septua.com", ownerName = "septua.com", packagePath = "api.server"))
public class EntregaEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listEntrega")
	public CollectionResponse<Entrega> listEntrega(@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		EntityManager mgr = null;
		Cursor cursor = null;
		List<Entrega> execute = null;

		try {
			mgr = getEntityManager();
			Query query = mgr.createQuery("select from Entrega as Entrega");
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				query.setHint(JPACursorHelper.CURSOR_HINT, cursor);
			}

			if (limit != null) {
				query.setFirstResult(0);
				query.setMaxResults(limit);
			}

			execute = (List<Entrega>) query.getResultList();
			cursor = JPACursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (Entrega obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Entrega>builder().setItems(execute).setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getEntrega")
	public Entrega getEntrega(@Named("id") String id) {
		EntityManager mgr = getEntityManager();
		Entrega entrega = null;
		try {
			entrega = mgr.find(Entrega.class, id);
		} finally {
			mgr.close();
		}
		return entrega;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param entrega the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertEntrega")
	public Entrega insertEntrega(Entrega entrega) {
		EntityManager mgr = getEntityManager();
		try {
			if (containsEntrega(entrega)) {
				throw new EntityExistsException("Object already exists");
			}
			mgr.persist(entrega);
		} finally {
			mgr.close();
		}
		return entrega;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param entrega the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateEntrega")
	public Entrega updateEntrega(Entrega entrega) {
		EntityManager mgr = getEntityManager();
		try {
			if (!containsEntrega(entrega)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.persist(entrega);
		} finally {
			mgr.close();
		}
		return entrega;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeEntrega")
	public void removeEntrega(@Named("id") String id) {
		EntityManager mgr = getEntityManager();
		try {
			Entrega entrega = mgr.find(Entrega.class, id);
			mgr.remove(entrega);
		} finally {
			mgr.close();
		}
	}

	private boolean containsEntrega(Entrega entrega) {
		EntityManager mgr = getEntityManager();
		boolean contains = true;
		try {
			Entrega item = mgr.find(Entrega.class, entrega.getId());
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

}
