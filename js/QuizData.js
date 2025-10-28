export class QuizData {
  Data = "";

  registerData(data) {
    this.Data = data;
  }

  getData() {
    return this.Data;
  }

  getCategorieNames() {
    const CategoryNames = this.Data.categories.map((category) => {
      return category.name;
    });
    return CategoryNames;
  }

  getCategorieIds() {
    const CategorieIds = this.Data.categories.map((category) => {
      return category.id;
    });
    return CategorieIds;
  }

  getQuestionIdsByCategoryId(categoryId) {
    const category = this.getCategoryDataByCategoryId(categoryId);
    return category.questions.map((question) => question.id);
  }

  getCategoryDataByCategoryId(categoryId) {
    const categoryData = this.Data.categories.find(
      (category) => category.id == categoryId
    );
    return categoryData;
  }

  getQuestionById(categoryId, questionId) {
    const categoryData = this.getCategoryDataByCategoryId(categoryId);
    const QuestionData = categoryData.questions.find(
      (question) => question.id == questionId
    );
    return QuestionData.question;
  }

  getAnswerById(categoryId, questionId) {
    const categoryData = this.getCategoryDataByCategoryId(categoryId);
    const QuestionData = categoryData.questions.find(
      (question) => question.id == questionId
    );
    return QuestionData.answer;
  }

  getQuestionImgById(categoryId, questionId) {
    const categoryData = this.getCategoryDataByCategoryId(categoryId);
    const QuestionData = categoryData.questions.find(
      (question) => question.id == questionId
    );
    return QuestionData.img;
  }

  getAnswerOptionsById(categoryId, questionId) {
    const categoryData = this.getCategoryDataByCategoryId(categoryId);
    const QuestionData = categoryData.questions.find(
      (question) => question.id == questionId
    );
    return QuestionData.options;
  }

  getAllQuestionInfoById(categoryId, questionId) {
    const question = this.getQuestionById(categoryId, questionId);
    const options = this.getAnswerOptionsById(categoryId, questionId);
    const img = this.getQuestionImgById(categoryId, questionId);
    const answer = this.getAnswerById(categoryId, questionId);
    return { question, options, img, answer };
  }

  savedProgressionInLocal(categoryId = "", questionId = "", userAnswered = 0) {
    const Progression = {
      categoryId,
      questionId,
      userAnswered,
    };
    localStorage.setItem("Progression", JSON.stringify(Progression));
  }

  getSavedProgressionDataFromLocal() {
    const Progression = localStorage.getItem("Progression");
    if (Progression != null) {
      return JSON.parse(Progression);
    }
    return Progression;
  }

  createCategoryOptionElement(categoryId, categoryName, index) {
    const label = document.createElement("label");
    label.setAttribute("class", "categorie_option");
    label.setAttribute("for", categoryId);
    const input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("id", categoryId);
    input.setAttribute("class", "categorie_input");
    input.setAttribute("name", "radio");
    if (!index) {
      input.checked = true;
    }
    const text = document.createTextNode(` ${categoryName} `);
    label.appendChild(input);
    label.appendChild(text);
    return label;
  }

  getAllCategoryOptionElements() {
    const container = document.createElement("div");
    this.Data.categories.map(({ id, name }, index) => {
      container.appendChild(this.createCategoryOptionElement(id, name, index));
    });
    return container.innerHTML;
  }

  updateCategoriesOnUi() {
    const categorie_options = document.querySelector(".categorie_options");
    categorie_options.innerHTML = this.getAllCategoryOptionElements();
    categorie_options.firstElementChild.firstElementChild.checked = true;
  }
}
