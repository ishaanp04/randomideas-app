import IdeasApi from '../services/ideasApi';

class IdeaList {
  constructor() {
    this._ideaListElement = document.querySelector('#idea-list');
    this._ideaFilter = document.querySelector('#idea-filter');
    this._ideas = [];
    this.getIdeas();

    this._validTags = new Set();
    this._validTags.add('technology');
    this._validTags.add('software');
    this._validTags.add('business');
    this._validTags.add('education');
    this._validTags.add('health');
    this._validTags.add('inventions');
    this._validTags.add('food');
  }

  addEventListeners() {
    this._ideaListElement.addEventListener('click', (e) => {
      if (
        e.target.classList.contains('delete') ||
        e.target.classList.contains('fa-times')
      ) {
        e.stopImmediatePropagation();

        if (confirm('Are you sure?')) {
          const ideaId = e.target.parentElement.parentElement.dataset.id;

          this.deleteIdea(ideaId);
        }
      }
    });
    this._filterForm.elements.tagFilterSelect.addEventListener('change', () => {
      if (this._filterForm.elements.tagFilterSelect.value === 'default') {
        this._filterForm.elements.filterText.value = '';
        return;
      }
      this._filterForm.elements.filterText.value =
        this._filterForm.elements.tagFilterSelect.value;
    });
    this._filterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const searchTerm = this._filterForm.elements.filterText.value;

      if (searchTerm === '') {
        this.render();
        return;
      }

      document.querySelectorAll('.card').forEach((ideaCard) => {
        const tagElementIndex =
          ideaCard.children[0].tagName === 'BUTTON' ? 2 : 1;
        if (
          ideaCard.children[tagElementIndex].textContent.toLowerCase() ===
          searchTerm.toLowerCase()
        ) {
          ideaCard.style.display = 'block';
        } else {
          ideaCard.style.display = 'none';
        }
      });
    });
  }

  async getIdeas() {
    try {
      const response = await IdeasApi.getIdeas();
      this._ideas = response.data.data;
      this.render();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteIdea(ideaId) {
    try {
      // delete from server
      await IdeasApi.deleteIdea(ideaId);

      // delete from DOM
      this._ideas.filter((idea) => {
        idea._id !== ideaId;
      });
      this.getIdeas();
    } catch (error) {
      alert('You can not delete this resource');
    }
  }

  addIdeaToList(idea) {
    this._ideas.push(idea);
    this.render();
  }

  getTagClass(tag) {
    tag = tag.toLowerCase();
    let tagClass = '';
    if (this._validTags.has(tag)) {
      tagClass = `tag-${tag}`;
    } else {
      tagClass = '';
    }
    return tagClass;
  }

  render() {
    this._ideaFilter.innerHTML = `
      <div class="idea-filter">
        <form id="idea-filter-form">
          <input type="text" name="filterText" placeholder="Filter by tag" />
          <select name='tagFilterSelect' id='tag-filter-select'>
            <option value='default'>All</option>
            <option value='Technology'>Technology</option>
            <option value='Software'>Software</option>
            <option value='Business'>Business</option>
            <option value='Health'>Health</option>
            <option value='Education'>Education</option>
            <option value='Inventions'>Inventions</option>
            <option value='Food'>Food</option>
          </select>
          <button class="filter-btn">Filter</button>
        </form>
      </div>
    `;
    this._ideaListElement.innerHTML = this._ideas
      .map((idea) => {
        const tagClass = this.getTagClass(idea.tag);
        const deleteBtn =
          idea.username === localStorage.getItem('username')
            ? `<button class="delete"><i class="fas fa-times"></i></button>`
            : '';
        return `
        <div class="card" data-id="${idea._id}">
          ${deleteBtn}
          <h3>
            ${idea.text}
          </h3>
          <p class="tag ${tagClass}">${idea.tag.toUpperCase()}</p>
          <p>
            Posted on <span class="date">${idea.date.substr(0, 10)}</span> by
            <span class="author">${idea.username}</span>
          </p>
        </div>
      `;
      })
      .join('');
    this._filterForm = document.querySelector('#idea-filter-form');
    this.addEventListeners();
  }
}

export default IdeaList;
