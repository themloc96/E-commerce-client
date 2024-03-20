function ReceptionInformation({ receptionInformation }) {
  return (
    <div className="reception-information">
      <div className="title-reception">
        <span>접수 정보</span>
      </div>
      <div className="line" />
      <div className="registration-block">
        <div className="registration-number">
          <div className="label">접수번호</div>
          <div className="field">
            <input defaultValue={receptionInformation.receiptCode} disabled />
          </div>
        </div>
        <div className="registration-number">
          <div className="label">접수자</div>
          <div className="field">
            <input
              defaultValue={receptionInformation.asEngineerName || ''}
              disabled
            />
          </div>
        </div>
        <div className="registration-number">
          <div className="label">접수일시</div>
          <div className="field">
            <input defaultValue={receptionInformation.createdAt} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ReceptionInformation;
