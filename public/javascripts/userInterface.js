export class UserInterface {
  constructor() {
    this.templates = this.#initialiseTemplates();
    this.contactCardsContainer = document.getElementById('contact-cards');
    this.contactCardsList = this.contactCardsContainer.querySelector('.list-group');
    this.addContact = document.getElementById('add-contact');
    this.modalLayer = document.querySelector('#modal-layer');
    this.formModal = document.querySelector('#form-modal');
    this.contactFormContainer = this.formModal.querySelector('#form-container');
    this.contactForm = this.contactFormContainer.querySelector('#contact-form');
    this.cancelForms = document.querySelectorAll('#cancel');
    this.formTitle = this.contactFormContainer.querySelector('#form-title');
    this.searchBar = document.getElementById('search-contact');
    this.clearSearch = document.getElementById('clear-search');
    this.addTag = document.getElementById('add-tag');
    this.tagFormModal = document.querySelector('#tag-form-modal');
    this.tagFormContainer = document.querySelector('#tag-form-container');
    this.tagForm = this.tagFormContainer.querySelector('#tag-form');
  }

  initialize(contacts) {
    this.displayContacts(contacts);
  }

  bindContactActions(editCallback, deleteCallback, tagCallback) {
    this.contactCardsList.addEventListener('click', e => {
      const target = e.target;
      const id = target.dataset.id;

      if (target.classList.contains('edit-contact')) {
        this.formTitle.textContent = 'Edit Contact';
        window.scrollTo(0, 0);
        editCallback(id);
      } else if (target.classList.contains('delete-contact')) {
        if (confirm('Are you sure you want to delete this contact?')) {
          deleteCallback(id);
        }
      } else if (target.classList.contains('badge')) {
        tagCallback(target.innerText);
      }
    });
  }

  bindSubmitTagForm(callback) {
    this.tagForm.addEventListener('submit', e => {
      e.preventDefault();
      const tagName = e.target.querySelector('#tag-name').value;
      callback(tagName);
    });
  }

  bindAddTag(callback) {
    this.addTag.addEventListener('click', e => {
      e.preventDefault();
      callback();
    });
  }

  bindClearSearch(callback) {
    this.clearSearch.addEventListener('click', e => {
      e.preventDefault();
      this.searchBar.value = '';
      callback();
    })
  }

  bindModal(callback) {
    this.modalLayer.addEventListener('click', e => {
      callback();
    });
  }

  bindAddContact(callback) {
    this.addContact.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo(0, 0);
      callback();
    });
  }

  bindCancelForm(callback) {
    Array.prototype.forEach.call(this.cancelForms, cancelButton => {
      cancelButton.addEventListener('click', e => {
        e.preventDefault();
        callback();
      });
    });
  }

  bindSearchContacts(callback) {
    this.searchBar.addEventListener('input', e => {
      const query = this.searchBar.value.toLowerCase().trim();
      callback(query);
    });
  }

  bindSubmitForm(callback) {
    this.contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const contactId = this.contactForm.dataset.id ? parseInt(this.contactForm.dataset.id, 10) : null;
      const checkboxes = e.currentTarget.querySelectorAll('.form-check>input');
      const tagValue = this.#getCheckedTags(checkboxes);

      const newContact = {
        id: contactId,
        full_name: e.currentTarget.querySelector('#contact-full-name').value,
        email: e.currentTarget.querySelector('#contact-email').value,
        phone_number: e.currentTarget.querySelector('#contact-phone-number').value,
        tags:tagValue,
      }

      callback(newContact);
    });
  }

  displayContacts(contacts) {
    if (contacts.length > 0) {
      contacts.sort((a, b) => a.full_name.toLowerCase() < b.full_name.toLowerCase() ? -1 : 1);
      contacts = this.#formatTags(contacts);

      this.contactCardsList.innerHTML = this.templates.contacts({ contacts });
    } else {
      this.contactCardsList.innerHTML = 'You have no contacts';
    }
  }

  displayAddTagForm(tags) {
    this.modalLayer.classList.add('show');
    this.modalLayer.classList.remove('hide');

    const saveButton = this.tagFormModal.querySelector('.tag-form-save');
    const cancelButton = this.tagFormModal.querySelector('.tag-form-cancel');

    this.tagForm.innerHTML = this.templates['tag-form-template']({ tags });
    this.tagFormModal.classList.add('show');
    this.tagFormModal.classList.remove('hide');

    this.tagForm.insertAdjacentElement('beforeend', saveButton);
    this.tagForm.insertAdjacentElement('beforeend', cancelButton);
  }


  displayNoContactsFoundMessage() {
    this.contactCardsList.innerHTML = 'No contacts found';
  }

  displayForm(contact, tags) {
    this.contactForm.querySelector('#form-tags-container').innerHTML = this.templates['contact-tags-template']({ tags });

    if (contact) {
      this.#checkExistingTags(contact);
      this.contactForm.querySelector('#contact-full-name').value = contact.full_name;
      this.contactForm.querySelector('#contact-email').value = contact.email;
      this.contactForm.querySelector('#contact-phone-number').value = contact.phone_number;
      this.contactForm.dataset.id = contact.id;
    }

    this.formModal.classList.add('show');
    this.formModal.classList.remove('hide');
    this.modalLayer.classList.add('show');
    this.modalLayer.classList.remove('hide');
  }

  displayFormErrors(errors, formElement) {
    const elements = [];
    errors.forEach(error => {
      const p = document.createElement('p');
      p.innerText = error;
      p.classList.add('form-error', 'mb-1');
      elements.push(p);
    });

    elements.forEach(element => {
      formElement.insertBefore(element, formElement.querySelector('form'));
    });
  }

  hideForms() {
    this.formModal.classList.add('hide');
    this.formModal.classList.remove('show');
    this.modalLayer.classList.add('hide');
    this.modalLayer.classList.remove('show');
    this.tagFormModal.classList.add('hide');
    this.tagFormModal.classList.remove('show');

    setTimeout(() => {
      this.contactForm.reset();
      this.formTitle.textContent = 'Create Contact';
      this.clearFormErrors(this.tagFormContainer);
      this.clearFormErrors(this.contactFormContainer);
    }, 301);

    this.contactForm.dataset.id = '';
  }

  clearFormErrors(formElement) {
    const errorElements = [];

    Array.prototype.forEach.call(formElement.children, child => {
      if (child.classList.contains('form-error')) {
        errorElements.push(child);
      }
    });

    errorElements.forEach(element => {
      formElement.removeChild(element);
    });
  }

  #checkExistingTags(contact) {
    const tags = contact.tags ? contact.tags.split(',') : [];
    const checkboxes = document.querySelectorAll('.form-check>input');

    Array.prototype.forEach.call(checkboxes, checkbox => {
      if (tags.includes(checkbox.dataset.name)) {
        checkbox.checked = 'true';
      }
    });
  }

  #getCheckedTags(checkboxes) {
    const checkedBoxes = Array.prototype.filter.call(checkboxes, checkbox => checkbox.checked);
    return checkedBoxes.map(box => box.dataset.name).join(',');
  }

  #formatTags(contacts) {
    const contactsCopy = JSON.parse(JSON.stringify(contacts));

    return contactsCopy.map(contact => {
      if (contact.tags) {
        contact.tags = contact.tags.split(',').map(tag => {
          return {
            name: tag.toLowerCase(),
          }
        });
      }

      return contact;
    });
  }

  #initialiseTemplates() {
    const templates = {};
    const handlebarsScripts = document.querySelectorAll('[type="text/x-handlebars"]');
    const partials = document.querySelectorAll('script[data-type="partial"]');

    Array.prototype.forEach.call(handlebarsScripts, temp => {
      templates[temp.id] = Handlebars.compile(temp.innerHTML);
    });

    Array.prototype.forEach.call(partials, temp => {
      Handlebars.registerPartial(temp.id, temp.innerHTML);
    });

    return templates;
  }
}