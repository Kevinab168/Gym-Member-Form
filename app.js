// Member Constructor
class Member {
  constructor(name, weight, age, membership) {
    this.name = name;
    this.weight = weight;
    this.age = age;
    this.membership = membership;
  }

  get cost() {
    if (this.membership === 'Bronze') {
      return 500;
    } else if (this.membership === 'Silver') {
      return 1000;
    } else if (this.membership === 'Gold') {
      return 1500;
    } else {
      return 2000;
    }
  }

  toJSON() {
    return {
      name: this.name,
      weight: this.weight,
      age: this.age,
      membership: this.membership,
      cost: this.cost,
    };
  }
}

// UI Constructor

class UI {
  static addMemberToList(member, newElement = true) {
    const list = document.getElementById('user-details');
    const row = document.createElement('tr');
    for (const property in member) {
      const memberInfo = document.createElement('td');
      memberInfo.textContent = member[property];
      row.appendChild(memberInfo);
    }

    // Code to be executed when putting in new value for the first time.
    if (newElement) {
      row.innerHTML += `
      <td>${member.cost}</td>
    `;
    }

    // Trash Icon
    row.innerHTML += `<td><a href='#'><i class="far fa-trash-alt trash-btn"></i></a></td>`;

    // Up Arrow
    row.innerHTML += `<td><a href='#'><i class="fas fa-arrow-up upgrade-item"></i>`;

    // Down Arrow
    row.innerHTML += `<td><a href='#'><i class="fas fa-arrow-down downgrade-item"></i>`;

    list.appendChild(row);
  }

  static clearFields() {
    document.getElementById('name').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('age').value = '';
  }

  static showAlert(message, className) {
    const container = document.querySelector('.container');

    // Create the alert
    const newAlert = document.createElement('div');
    newAlert.className = `alert ${className}`;
    newAlert.textContent = message;

    // Insert the alert
    container.insertBefore(newAlert, container.childNodes[2]);

    // Clear the alert after some time
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 2000);
  }

  static removeRow(target, memberslist) {
    // Remove the item from local storage
    const row = target.parentNode.parentNode.parentNode;
    const rowElems = row.childNodes;
    const name = rowElems[0].textContent,
      weight = rowElems[1].textContent,
      age = rowElems[2].textContent,
      membership = rowElems[3].textContent;

    const removeMem = new Member(name, weight, age, membership);

    // Check each element of the list in order to see whether or not the property values are equal to each other.
    memberslist.forEach(function (member) {
      const compareMem = new Member(
        member.name,
        member.weight,
        member.age,
        member.membership
      );

      if (
        removeMem.name === compareMem.name &&
        removeMem.weight === compareMem.weight &&
        removeMem.age === compareMem.age &&
        removeMem.membership === compareMem.membership
      ) {
        const index = memberslist.indexOf(member);
        memberslist.splice(index, 1);
        localStorage.setItem('member', JSON.stringify(memberslist));

        // Add an UI alert to show that item has been removed.
      }
    });

    // Remove the item from the dom
    if (target.className === 'far fa-trash-alt trash-btn') {
      target.parentNode.parentNode.parentNode.remove();
      UI.showAlert('Removed Item', 'error');
    }
  }

  static getLocalStorage() {
    // let memberslist = localStorage.getItem('member');
    let memberslist = localStorage.getItem('member');
    if (memberslist === null) {
      memberslist = [];
    } else {
      memberslist = JSON.parse(memberslist);
      memberslist.forEach(function (member) {
        // Have to activate the delete button when repopulating the rows.
        const newMem = UI.addMemberToList(member, false);
      });
    }
    return memberslist;
  }

  // Add the newly created items to local storage
  static persistToLocalStorage(memberslist) {
    localStorage.setItem('member', JSON.stringify(memberslist));
  }
}

// Upgrade  parts of a users membership.

class MemChanges {
  // Upgrade a specific users membership
  static upgradeMembership(target, memberslist) {
    // This is going to take the data and upgrade the memberslist Data likewise.

    // Get the parts of the book object and upgrade the membership type

    const pElement = target.parentNode.parentNode.parentNode;

    let name = pElement.childNodes[0].textContent,
      weight = pElement.childNodes[1].textContent,
      age = pElement.childNodes[2].textContent,
      membership = pElement.childNodes[3].textContent;

    const removeMem = new Member(name, weight, age, membership);

    //  Change the DOM

    // Make the change in the memberslist
    memberslist.forEach(function (member) {
      const compareMem = new Member(
        member.name,
        member.weight,
        member.age,
        member.membership
      );

      if (
        removeMem.name === compareMem.name &&
        removeMem.weight === compareMem.weight &&
        removeMem.age === compareMem.age &&
        removeMem.membership === compareMem.membership
      ) {
        if (member.membership === 'Bronze') {
          member.membership = 'Silver';
        } else if (member.membership === 'Silver') {
          member.membership = 'Gold';
        } else if (member.membership === 'Gold') {
          member.membership = 'Platinum';
        }

        const newMember = new Member(
          member.name,
          member.weight,
          member.age,
          member.membership
        );

        const index = memberslist.indexOf(member);

        memberslist.splice(index, 1, newMember);

        localStorage.setItem('member', JSON.stringify(memberslist));
      }
    });

    if (pElement.childNodes[3].textContent === 'Bronze') {
      pElement.childNodes[3].textContent = 'Silver';
      if (parseInt(pElement.childNodes[4].textContent)) {
        pElement.childNodes[4].textContent = 1000;
      } else {
        pElement.childNodes[5].textContent = 1000;
      }
    } else if (pElement.childNodes[3].textContent === 'Silver') {
      pElement.childNodes[3].textContent = 'Gold';
      if (parseInt(pElement.childNodes[4].textContent)) {
        pElement.childNodes[4].textContent = 1500;
      } else {
        pElement.childNodes[5].textContent = 1500;
      }
    } else {
      pElement.childNodes[3].textContent = 'Platinum';
      if (parseInt(pElement.childNodes[4].textContent)) {
        pElement.childNodes[4].textContent = 2000;
      } else {
        pElement.childNodes[5].textContent = 2000;
      }
    }
  }

  // This will lower the membership type will lower.
  static lowerMembership(target) {
    const pElement = target.parentNode.parentNode.parentNode;

    let name = pElement.childNodes[0].textContent,
      weight = pElement.childNodes[1].textContent,
      age = pElement.childNodes[2].textContent,
      membership = pElement.childNodes[3].textContent;

    const removeMem = new Member(name, weight, age, membership);

    //  Change the DOM

    // Make the change in the memberslist
    memberslist.forEach(function (member) {
      const compareMem = new Member(
        member.name,
        member.weight,
        member.age,
        member.membership
      );

      if (
        removeMem.name === compareMem.name &&
        removeMem.weight === compareMem.weight &&
        removeMem.age === compareMem.age &&
        removeMem.membership === compareMem.membership
      ) {
        if (member.membership === 'Silver') {
          member.membership = 'Bronze';
        } else if (member.membership === 'Gold') {
          member.membership = 'Silver';
        } else if (member.membership === 'Platinum') {
          member.membership = 'Gold';
        }

        const newMember = new Member(
          member.name,
          member.weight,
          member.age,
          member.membership
        );

        const index = memberslist.indexOf(member);

        memberslist.splice(index, 1, newMember);

        localStorage.setItem('member', JSON.stringify(memberslist));
      }
    });

    if (pElement.childNodes[3].textContent === 'Silver') {
      pElement.childNodes[3].textContent = 'Bronze';
      if (parseInt(pElement.childNodes[4].textContent)) {
        pElement.childNodes[4].textContent = 500;
      } else {
        pElement.childNodes[5].textContent = 500;
      }
    } else if (pElement.childNodes[3].textContent === 'Gold') {
      pElement.childNodes[3].textContent = 'Silver';
      if (parseInt(pElement.childNodes[4].textContent)) {
        pElement.childNodes[4].textContent = 1000;
      } else {
        pElement.childNodes[5].textContent = 100;
      }
    } else if (pElement.childNodes[3].textContent === 'Platinum') {
      pElement.childNodes[3].textContent = 'Gold';
      if (parseInt(pElement.childNodes[4].textContent)) {
        pElement.childNodes[4].textContent = 1500;
      } else {
        pElement.childNodes[5].textContent = 1500;
      }
    }
  }
}

// Retreives the item from Local Storage

const memberslist = UI.getLocalStorage();

// Add a User
document.querySelector('#user-input').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value,
    weight = document.getElementById('weight').value,
    age = document.getElementById('age').value,
    membership = document.getElementById('membership').value;
  const newGymmember = new Member(name, weight, age, membership);
  // Validate the date

  if (name === '' || weight === '' || age === '') {
    UI.showAlert('Please fill out the missing elements', 'error');
  } else {
    // Add the new Gym member to the list
    UI.addMemberToList(newGymmember);
    console.log(newGymmember);
    UI.showAlert(`Added ${newGymmember.name}`, 'success');
    memberslist.push(newGymmember);
    UI.persistToLocalStorage(memberslist);
    UI.clearFields();
  }
});

document.querySelector('#user-details').addEventListener('click', function (e) {
  // Prevent the default Behavior
  e.preventDefault();

  // Delete Button Functionality
  if (e.target.className === 'far fa-trash-alt trash-btn') {
    UI.removeRow(e.target, memberslist);
  }

  // Upgrade Arrow functionality
  if (e.target.className === 'fas fa-arrow-up upgrade-item') {
    MemChanges.upgradeMembership(e.target, memberslist);
  }

  if (e.target.className === 'fas fa-arrow-down downgrade-item') {
    MemChanges.lowerMembership(e.target, memberslist);
  }
});
