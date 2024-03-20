/* eslint-disable no-unused-expressions */
const printComponent = (contentId, ifmId, closePopup) => {
  const content = document.getElementById(contentId);
  const pri = document.getElementById(ifmId).contentWindow;
  pri.document.open();
  pri.document.write(content.outerHTML);
  pri.document.close();
  pri.focus();
  pri.print();
  closePopup && closePopup();
};

export default printComponent;
