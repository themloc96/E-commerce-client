import { formatCost } from '../../../../utils/helpers';

function EstimatedMaterial({ estimatedMaterial }) {
  const formatPrice = value => {
    const cost = formatCost(Math.floor(value));
    return cost.replace(/,/g, ',');
  };

  return (
    <div className="estimated-material">
      <div className="title">
        <h2>예상 자재</h2>
      </div>
      <div className="line" />
      <div className="registration-table">
        <table>
          <thead>
            <tr className="header">
              <th className="col-1">
                <span>No</span>
              </th>
              <th className="col-2">
                <span>품번</span>
              </th>
              <th className="col-3">
                <span>품명</span>
              </th>
              <th className="col-4">
                <span>수량</span>
              </th>
              <th className="col-5">
                <span>소비자가</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {estimatedMaterial?.anticipationMaterialsList?.map(
              (item, index) => {
                return (
                  <tr key={item.id}>
                    <td className="col-1">
                      <span>{index + 1}</span>
                    </td>
                    <td className="col-2">
                      <span>{item?.asMaterialCode || ''}</span>
                    </td>
                    <td className="col-3">
                      <span>{item?.asMaterialsName || ''}</span>
                    </td>
                    <td className="col-4">
                      <span>{item?.asAnticipationMaterialCount || 0}</span>
                    </td>
                    <td className="col-5">
                      <span>{formatPrice(item?.asMaterialPrice) || 0}</span>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default EstimatedMaterial;
