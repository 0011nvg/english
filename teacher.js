// Display preference for this static course. Answers are shipped to the browser for auto-check.
export function bindTeacherMode({dialog, student, teacher, onChange}) {
  const form = dialog.querySelector('form');
  const code = form.querySelector('input');
  const error = form.querySelector('[role="alert"]');
  const unlock = form.querySelector('[data-unlock], #teacher-unlock');
  let enabled = false;

  function setMode(value) {
    enabled = value;
    student.classList.toggle('active', !value);
    teacher.classList.toggle('active', value);
    student.setAttribute('aria-pressed', String(!value));
    teacher.setAttribute('aria-pressed', String(value));
    onChange(value);
  }

  function checkCode() {
    if (code.value.normalize('NFKC').trim() === 'Кекс') {
      dialog.close();
      setMode(true);
      return;
    }
    error.hidden = false;
    code.setAttribute('aria-invalid', 'true');
    code.focus();
  }

  student.addEventListener('click', () => { if (enabled) setMode(false); });
  teacher.addEventListener('click', () => {
    if (!enabled) {
      dialog.showModal();
      code.focus();
    }
  });
  unlock.addEventListener('click', checkCode);
  code.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.isComposing) {
      event.preventDefault();
      checkCode();
    }
  });
  dialog.addEventListener('close', () => {
    code.value = '';
    code.removeAttribute('aria-invalid');
    error.hidden = true;
  });
}
