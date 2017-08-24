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

@Api(name = "rastreadorendpoint", namespace = @ApiNamespace(ownerDomain = "septua.com", ownerName = "septua.com", packagePath = "api.server"))
public class RastreadorEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listRastreador")
	public CollectionResponse<Rastreador> listRastreador(@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		EntityManager mgr = null;
		Cursor cursor = null;
		List<Rastreador> execute = null;

		try {
			mgr = getEntityManager();
			Query query = mgr.createQuery("select from Rastreador as Rastreador");
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				query.setHint(JPACursorHelper.CURSOR_HINT, cursor);
			}

			if (limit != null) {
				query.setFirstResult(0);
				query.setMaxResults(limit);
			}

			execute = (List<Rastreador>) query.getResultList();
			cursor = JPACursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (Rastreador obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Rastreador>builder().setItems(execute).setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getRastreador")
	public Rastreador getRastreador(@Named("id") String id) {
		EntityManager mgr = getEntityManager();
		Rastreador rastreador = null;
		try {
			rastreador = mgr.find(Rastreador.class, id);
		} finally {
			mgr.close();
		}
		return rastreador;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param rastreador the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertRastreador")
	public Rastreador insertRastreador(Rastreador rastreador) {
		EntityManager mgr = getEntityManager();
		try {
			if (containsRastreador(rastreador)) {
				throw new EntityExistsException("Object already exists");
			}
			mgr.persist(rastreador);
		} finally {
			mgr.close();
		}
		return rastreador;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param rastreador the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateRastreador")
	public Rastreador updateRastreador(Rastreador rastreador) {
		EntityManager mgr = getEntityManager();
		try {
			if (!containsRastreador(rastreador)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.persist(rastreador);
		} finally {
			mgr.close();
		}
		return rastreador;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeRastreador")
	public void removeRastreador(@Named("id") String id) {
		EntityManager mgr = getEntityManager();
		try {
			Rastreador rastreador = mgr.find(Rastreador.class, id);
			mgr.remove(rastreador);
		} finally {
			mgr.close();
		}
	}

	private boolean containsRastreador(Rastreador rastreador) {
		EntityManager mgr = getEntityManager();
		boolean contains = true;
		try {
			Rastreador item = mgr.find(Rastreador.class, rastreador.getId());
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
