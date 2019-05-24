export const liquidTemplate = `
  <div style="width: 300px; display: flex; flex: 1; justify-content: center">
    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">CARD NUMBER*</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Please enter the card number">
        <small id="emailHelp" class="form-text text-muted">No spaces or dashes</small>
      </div>
      <button id="checkBalanceBtn" type="button" class="btn btn-outline-secondary">CHECK BALANCE</button>
    </form>
    <div class="modal" id="myModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Submitted successfully</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export const liquidData = {};

export const jsStringArray = [
  `
    $('#checkBalanceBtn').click(function() {
      queryRecords({
        search: {
          formulas: [
            {formula: '$.self.id=="1032727218423366656"'}
          ]
        },
        callback: function(result) {
          console.info(result);
          $('#myModal').modal('show')
        }
      });
    });
  `,
];
