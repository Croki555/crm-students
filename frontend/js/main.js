const table = document.querySelector('.table');
const tbody = table.querySelector('tbody');
const form = document.querySelector('.form');
const filterForm = document.querySelector('.filter-form');

const urlBase = 'http://localhost:3000';

// Изначальный массив студентов
let studentsList = [
  {
    firstName: 'Павел',
    lastName: 'Соколов',
    surnName: 'Андреевич',
    dateOfBirth: new Date(2002, 11, 26),
    startYear: 2020,
    faculty: 'Пуффендуй'
  },
  {
      firstName: 'Максим',
      lastName: 'Ульянов',
      surnName: 'Андреевич',
      dateOfBirth: new Date(1980, 8, 22),
      startYear: 2021,
      faculty: 'Слизерин'
  },
  {
      firstName: 'Илья',
      lastName: 'Еремин',
      surnName: 'Платонович',
      dateOfBirth: new Date(1992, 7, 19),
      startYear: 2015,
      faculty: 'Когтевран'
  },
  {
      firstName: 'Злата',
      lastName: 'Гордеева',
      surnName: 'Игоревна',
      dateOfBirth: new Date(1983, 2, 5),
      startYear: 2008,
      faculty: 'Гриффиндор'
  },
  {
      firstName: 'Александр',
      lastName: 'Быков',
      surnName: 'Андреевич',
      dateOfBirth: new Date(2000, 11, 29),
      startYear: 2021,
      faculty: 'Пуффендуй'
  },
  {
      firstName: 'Полина',
      lastName: 'Кузьмина',
      surnName: 'Ивановна',
      dateOfBirth: new Date(2002, 11, 26),
      startYear: 2022,
      faculty: 'Слизерин'
  },
]

async function checkStudents() {
  const request = await fetch(`${urlBase}/api/students`);
  const data = await request.json();
  if(data.length == 0) {
    loadStudents();
  }
  return data;
}

checkStudents().then(
  getStudentsList().then(studentsList => {
    renderStudentsTable(studentsList)
  })
);

async function loadStudents() {
  studentsList.forEach(function(el) {
    const request = fetch(`${urlBase}/api/students`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: `${el.firstName}`.trim(),
        surname: `${el.surnName}`.trim(),
        lastname: `${el.lastName}`.trim(),
        birthday: new Date(el.dateOfBirth),
        studyStart: `${el.startYear}`.trim(),
        faculty: `${el.faculty}`.trim()
      })
    });
    return request;
  })
  const request = await fetch(`${urlBase}/api/students`);
  const data = await request.json();
  return data;
}


// Получить список студентов
async function getStudentsList() {
  const request = await fetch(`${urlBase}/api/students`);
  const data = await request.json();
  let studentsList = []
  data.forEach(el => {
    studentsList.push(el)
  })
  return(studentsList);
}

let students = [...studentsList];

// Функция вывода одного студента в таблицу
async function getStudentItem(studentObj) {
    const id = studentObj.id,
            firstName = studentObj.name.trim(),
              lastName = studentObj.lastname.trim(),
                  surnName = studentObj.surname.trim(),
                      dateOfBirth = new Date(studentObj.birthday),
                          currentYear = new Date().getFullYear(),
                              startYear = Number(studentObj.studyStart),
                                  endYear = startYear + 4,
                                      faculty = studentObj.faculty.trim(),
                                          course = currentYear - startYear + 1;

    let yearsStudy = null;
    if (new Date().getMonth() >= 8) {
        if (course <= 4) {
            yearsStudy = `${course} курс`;
        } else {
            yearsStudy = 'Закончил';
        }
    } else {
        yearsStudy = `${course} курс`;
    }
    const fullName = `${lastName} ${firstName} ${surnName}`;

    let timeDiff = new Date().getTime() - dateOfBirth.getTime();

    let age = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));

    let day = dateOfBirth.getDate();
    let month = dateOfBirth.getMonth();
    month++;
    let year = dateOfBirth.getFullYear();
    let formattedDate = `${day < 10 ? "0" : ''}${day}.${month < 10 ? "0" : ''}${month}.${year}`;

    const tr = document.createElement('tr');
    const body = `  <td>${fullName}</td>
                    <td>${faculty}</td>
                    <td>${formattedDate} (${age})</td>
                    <td>${startYear}-${endYear} (${yearsStudy.toLowerCase()})</td>
                    <td>
                      <div class="action">
                        <button class="btn btn-danger" onclick="deleteStudent(this, ${id})">Удалить</button>
                      </div>
                    </td>
                    `;
    tr.innerHTML = body;
    tbody.append(tr)
    return tr;
}
// Функция отрисовки всех студентов
async function renderStudentsTable(studentsArray) {
    tbody.innerHTML = '';

    const name = document.querySelector('input[data-filter="name"]'),
        faculty = document.querySelector('input[data-filter="faculty"]'),
        startYear = document.querySelector('input[data-filter="startYear"]'),
        endYear = document.querySelector('input[data-filter="endYear"]');

    let nameVal = String(name.value).trim().toLowerCase(),
        facultyVal = String(faculty.value).trim().toLowerCase(),
        startYearVal = String(startYear.value).trim().toLowerCase(),
        endYearVal = String(endYear.value).trim().toLowerCase();

    let copyArr = [...studentsArray];

    if(nameVal !== '') copyArr = filter(copyArr, 'name', nameVal);
    if(facultyVal !== '') copyArr = filter(copyArr, 'faculty', facultyVal);
    if(startYearVal !== '') copyArr = filter(copyArr, 'startYear', startYearVal);
    if(endYearVal !== '') copyArr = filter(copyArr, 'endYear', endYearVal);

    if(copyArr.length == 0) {
      checkStudents().then(data => {
        renderStudentsTable(data)
      });
    } else {
      copyArr.forEach((el, indx) => {
        getStudentItem(el)
    })
    }
}



// Функция валидации перед добавлением студента
function validate(data, birthDate, startYear) {
    const currentDate = new Date();
    const bDate = new Date(birthDate.value);
    const sYear = parseInt(startYear.value);
    birthDate.classList.remove('is-valid', 'is-invalid')
    birthDate.nextElementSibling.classList.remove('valid-feedback', 'invalid-feedback')
    birthDate.nextElementSibling.innerHTML = '';

    startYear.classList.remove('is-valid', 'is-invalid')
    startYear.nextElementSibling.classList.remove('valid-feedback', 'invalid-feedback')
    startYear.nextElementSibling.innerHTML = '';

    if (bDate >= new Date("1900-01-01") && bDate <= currentDate) {
        birthDate.removeAttribute('invalid')
        birthDate.classList.add('is-valid')
        birthDate.nextElementSibling.classList.add('valid-feedback')
        birthDate.nextElementSibling.innerHTML = 'Всё ок';
    } else {
        birthDate.setAttribute('invalid', '')
        birthDate.classList.add('is-invalid')
        birthDate.nextElementSibling.classList.add('invalid-feedback')
        birthDate.nextElementSibling.innerHTML = 'Дата рождения не находится в диапазоне от 01.01.1900 до текущей даты';
    }

    if (sYear >= 2000 && sYear <= currentDate.getFullYear()) {
        startYear.removeAttribute('invalid')
        startYear.classList.add('is-valid')
        startYear.nextElementSibling.classList.add('valid-feedback')
        startYear.nextElementSibling.innerHTML = 'Всё ок';
    } else {
        startYear.setAttribute('invalid', '')
        startYear.classList.add('is-invalid')
        startYear.nextElementSibling.classList.add('invalid-feedback')
        startYear.nextElementSibling.innerHTML = 'Год начала обучения не находится в диапазоне от 2000-го до текущего года';
    }
    data.forEach(function(el) {
        el.classList.remove('is-valid', 'is-invalid')
        el.nextElementSibling.classList.remove('valid-feedback', 'invalid-feedback')
        el.nextElementSibling.innerHTML = '';
        if(el.value.trim().length == '') {
            el.setAttribute('invalid', '')
            el.classList.add('is-invalid')
            el.nextElementSibling.classList.add('invalid-feedback')
            el.nextElementSibling.innerHTML = 'Обязательно для заполнения';
        } else {
            el.removeAttribute('invalid')
            el.classList.add('is-valid')
            el.nextElementSibling.classList.add('valid-feedback')
            el.nextElementSibling.innerHTML = 'Всё ок';
        }
    })
    let count = 0
    let inputs = document.querySelectorAll('.form input');
    inputs.forEach(function(el) {
        if(el.hasAttribute('invalid')) {
            count++;
        }
    })
    return count == 0 ? true : false;
}

// Добавление события отправки формы для добавления студента
form.addEventListener('submit', function(ev)  {
    ev.preventDefault();
    const fName = document.getElementById('firstName'),
            lName = document.getElementById('lastName'),
                sName = document.getElementById('surnName'),
                    dBirth = document.getElementById('dateOfBirth'),
                        stYear = document.getElementById('startYear'),
                            fcl = document.getElementById('faculty');
    data = [fName, lName, sName, fcl];
    let obj = {
        name: fName.value.trim(),
        lasname: lName.value.trim(),
        surname: sName.value.trim(),
        birthday: new Date(dBirth.value),
        studyStart: stYear.value.trim(),
        faculty: fcl.value.trim()
    };
    if(validate(data, dBirth, stYear)) {
        addStudent(obj).then(result => {
          getStudentItem(result);
        });
        let inputs = document.querySelectorAll('.form input');
        inputs.forEach(function(el) {
            el.classList.remove('is-valid', 'is-invalid')
            el.nextElementSibling.classList.remove('valid-feedback', 'invalid-feedback')
            el.nextElementSibling.innerHTML = '';
        })
        this.reset()
    }
})

async function addStudent(obj) {
  const request = await fetch(`${urlBase}/api/students`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          name: obj.name,
          surname: obj.surname,
          lastname: obj.lasname,
          birthday: obj.birthday,
          studyStart: obj.studyStart,
          faculty: obj.faculty
        })
      });
  const result = await request.json();
  return result;
}

async function deleteStudent(obj, id) {
  if(confirm('Вы уверены?')) {
    obj.closest('tr').remove()
    fetch(`${urlBase}/api/students/${id}`, {
      method: 'DELETE'
    })
}
}

// Функция сортировки студентов
function sortStudents(studentsArray, field, dir = false) {
    let result = studentsArray.slice().sort(function(a, b) {
        let A = a[field];
        let B = b[field];
        if(field == 'name') {
            A = `${a.lastname} ${a.name} ${a.surname}`.toUpperCase();
            B = `${b.lastname} ${b.name} ${b.surname}`.toUpperCase();
        }

        if(field == 'dateOfBirth') {
            A = new Date(a.birthday).getTime();
            B = new Date(b.birthday).getTime();
        }
        let dirIf = dir == false ? A < B : A > B;

        if(dirIf == true) return -1;
    })

    return result;
}

//Добавление события клика на ячейку таблицы, для сортировки данных
const th = document.querySelectorAll('th[data-sort]');
let dir = true;
th.forEach(function(el) {
    el.addEventListener('click', function(ev) {
        const field = el.getAttribute('data-sort')

        th.forEach(el => {
            if(el == ev.target) {
                ev.target.classList.toggle('sort')
            }else {
                el.classList.remove('sort')
            }
        })

        dir = !dir;
        getStudentsList().then(studentsList => {
          renderStudentsTable(sortStudents(studentsList, field, dir));
        })
    })
})

// Функция фильтрации
function filter(studentsArray, field, string) {
    let result = studentsArray.filter(function(el, idx, arr) {
        let str;

        if(field == 'name') {

            str = string.trim().toLowerCase();
            searchStr = `${el.lastname} ${el.name} ${el.surname}`.toLowerCase();
            return searchStr.indexOf(str) != -1 ? true : false;


        }else if(field == 'faculty') {

            str = string.trim().toLowerCase();
            searchStr = el.faculty.toLowerCase();
            return searchStr.indexOf(str) !== -1 ? true : false;

        }else if(field == 'startYear') {

            return Number(el.studyStart) == Number(string) ? true : false;

        }else if(field == 'endYear') {
            return Number(el.studyStart) + 4 == Number(string) ? true : false;

        }

    })
    return result;
}

// Добавление события на изменение значения в полях для филтрации данных
filterForm.addEventListener('submit', function(ev) {
  ev.preventDefault();
  tbody.innerHTML = '';
  getStudentsList().then(studentsList => {
    renderStudentsTable(studentsList);
  }).catch(error => {
    console.log(error)
  })
})
