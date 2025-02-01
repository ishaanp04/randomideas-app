import IdeasApi from '../services/ideasApi';
import IdeaList from './IdeaList';

class IdeaForm {
  constructor() {
    this._formModal = document.querySelector('#form-modal');
    this._ideaList = new IdeaList();
  }

  addEventListeners() {
    this._form.addEventListener('submit', this.handleSubmit.bind(this));
    this._form.elements.tagSelect.addEventListener('change', () => {
      if (this._form.elements.tagSelect.value === 'default') {
        this._form.elements.tag.value = '';
        return;
      }
      this._form.elements.tag.value = this._form.elements.tagSelect.value;
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (
      !this._form.elements.text.value ||
      !this._form.elements.tag.value ||
      !this._form.elements.username.value
    ) {
      alert('Please enter all fields.');
      return;
    }

    // save user to local storage
    localStorage.setItem('username', this._form.elements.username.value);

    const idea = {
      text: this._form.elements.text.value,
      tag: this._form.elements.tag.value,
      username: this._form.elements.username.value,
    };

    // add idea to server
    const newIdea = await IdeasApi.createIdea(idea);

    // add idea to the ideaList
    this._ideaList.addIdeaToList(newIdea.data.data);

    // clear the form fields
    this._form.elements.text.value = '';
    this._form.elements.tag.value = '';
    this._form.elements.username.value = '';

    this.render();

    document.dispatchEvent(new Event('closemodal'));
  }

  render() {
    this._formModal.innerHTML = `
        <form id="idea-form">
          <div class="form-control">
            <label for="idea-text">Enter a Username</label>
            <span>(Please use only one username)</span>
            <input type="text" name="username" id="username" value="${
              localStorage.getItem('username')
                ? localStorage.getItem('username')
                : ''
            }" />
          </div>
          <div class="form-control">
            <label for="idea-text">What's Your Idea?</label>
            <textarea name="text" id="idea-text"></textarea>
          </div>
          <div class="form-control">
            <label for="tag">Tag</label>
            <input type="text" name="tag" id="tag" />
            <select name='tagSelect' id='tag-select'>
              <option value='default'>Select</option>
              <option value='Technology'>Technology</option>
              <option value='Software'>Software</option>
              <option value='Business'>Business</option>
              <option value='Health'>Health</option>
              <option value='Education'>Education</option>
              <option value='Inventions'>Inventions</option>
              <option value='Food'>Food</option>
            </select>
          </div>
          <button class="btn" type="submit" id="submit">Submit</button>
        </form>
    `;

    this._form = document.querySelector('#idea-form');
    this.addEventListeners();
  }
}

export default IdeaForm;
