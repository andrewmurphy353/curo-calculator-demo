import { CashFlowCharge, CashFlowPayment, Convention, MathUtils, Profile } from "@curo/calculator";

/**
 * A utility class for building the demo amortisation and APR/XIRR proof schedules.
 * 
 * This is a reference implementation which should be adapted in a real world application.
 */
export default class ScheduleBuilder {
  private _profile: Profile;
  private _locale: string[];

  /**
   * Creates an instance of the schedule builder.
   * 
   * @param profile containing the cash flows
   * @param locale (optional) to use in formatting date and monetary output. Default is 
   * en-IE when undefined.
   */
  constructor(profile: Profile, locale?: string) {
    this._profile = profile;
    this._locale = [];
    if (locale !== undefined) {
      this._locale.push(locale);
    }
    this._locale.push("en-IE");
  }

  /**
   * Builds a schedule appropriate to the day count convention used in the calculation. There are
   * two mutually exclusive schedule options, the first being an APR/XIRR calculation proof schedule,
   * and the second an amortisation schedule.
   * 
   * Where time periods between cash flows are determined with reference to the first cash
   * flow date, as in APR and XIRR calculations, the method returns a calculation proof
   * schedule. In all other cases an amortisation schedule is returned to prove the implicit
   * interest rate within the cash flow profile produces a net future value of zero.
   * 
   * @param aprResult 
   */
  public buildSchedule(aprResult?: number): HTMLDivElement {
    if (this._profile.dayCount.dayCountRef() === Convention.DRAWDOWN) {
      // Annualised rate
      return this.buildProof(aprResult !== undefined ? aprResult : 0.0);
    } else {
      // Effective periodic rate
      return this.buildAmort();
    }
  }

  /**
   * Builds an APR/XIRR calculation proof.
   * 
   * @param aprResult 
   */
  private buildProof(aprResult: number): HTMLDivElement {

    const containerDiv = document.createElement("div");
    const tbl = document.createElement("table");

    const caption = document.createElement("caption");
    caption.innerText = "APR / XIRR Proof Schedule";
    tbl.appendChild(caption);

    const thead = document.createElement("thead");
    const thr = thead.insertRow(0);
    thr.insertCell(0).outerHTML = "<th>Label</th>";
    thr.insertCell(1).outerHTML =
      (this._profile.dayCount.usePostingDates()) ? "<th>Posting Date</th>" : "<th>Value Date</th>";
    thr.insertCell(2).outerHTML = "<th>Amount</th>";
    thr.insertCell(3).outerHTML = "<th>Day Count Factor</th>";
    thr.insertCell(4).outerHTML = "<th>Amount Discounted [1]</th>";
    tbl.appendChild(thead);

    const tbody = document.createElement("tbody");
    let amtDiscTtl = 0;

    for (const cashFlow of this._profile.cashFlows) {
      const amtDisc =
        cashFlow.value * Math.pow(1 + aprResult, -cashFlow.periodFactor.factor);
      amtDiscTtl += amtDisc;

      const tr = tbody.insertRow();
      tr.insertCell().appendChild(document.createTextNode(cashFlow.label));
      tr.insertCell().appendChild(
        document.createTextNode(
          (this._profile.dayCount.usePostingDates()) ?
            cashFlow.postingDate.toLocaleDateString(this._locale) :
            cashFlow.valueDate.toLocaleDateString(this._locale))
      );
      tr.insertCell().appendChild(document.createTextNode(
        cashFlow.value.toLocaleString(this._locale,
          {
            minimumFractionDigits: this._profile.precision,
            maximumFractionDigits: this._profile.precision
          }))
      );
      tr.insertCell().appendChild(
        document.createTextNode(cashFlow.periodFactor.toString)
      );
      tr.insertCell().appendChild(document.createTextNode(
        amtDisc.toLocaleString(this._locale,
          {
            minimumFractionDigits: 6,
            maximumFractionDigits: 6
          }))
      );
    }
    tbl.appendChild(tbody);

    const tfoot = document.createElement("tfoot");
    const fr = tfoot.insertRow(0);
    fr.insertCell(0).outerHTML =
      "<td colspan='4'>Total of discounted amounts (should sum to zero)</th>";
    fr.insertCell(1).appendChild(document.createTextNode(
      amtDiscTtl.toLocaleString(this._locale,
        {
          minimumFractionDigits: 6,
          maximumFractionDigits: 6
        }))
    );
    tbl.appendChild(tfoot);

    containerDiv.appendChild(tbl);

    const p1 = document.createElement("p");
    p1.appendChild(document.createTextNode(
      "[1] Amount Discounted = Amount * ((1 + RateResultAsDecimal) ^ -Factor)"));
    containerDiv.appendChild(p1);

    const p2 = document.createElement("p");
    p2.appendChild(document.createTextNode(
      `This schedule demonstrates that the derived XIRR/APR result is mathematically correct; 
      you can cross-check the result by substituting the inputs from each line into the formula
      at the bottom of the table and then sum the results (use the unrounded XIRR/APR result 
      when you do this).
      Take note that the production of a proof schedule only makes sense in the context of APR
      and XIRR interest rate calculations where time periods are measured with reference to the
      initial drawdown date. For calculations based on compound interest use an amortisation
      schedule.`));
    containerDiv.appendChild(p2);

    return containerDiv;
  }

  /**
   * Builds an amortisation schedule.
   */
  private buildAmort(): HTMLDivElement {

    const containerDiv = document.createElement("div");
    const tbl = document.createElement("table");

    const caption = document.createElement("caption");
    caption.innerText = "Amortisation Schedule";
    tbl.appendChild(caption);

    const thead = document.createElement("thead");
    const thr = thead.insertRow(0);
    thr.insertCell(0).outerHTML = "<th>Label</th>";
    thr.insertCell(1).outerHTML = "<th>Date</th>";
    thr.insertCell(2).outerHTML = "<th>Amount</th>";
    thr.insertCell(3).outerHTML = "<th>Interest</th>";
    thr.insertCell(4).outerHTML = "<th>Capital Balance</th>";
    tbl.appendChild(thead);

    const tbody = document.createElement("tbody");
    let balanceCFwd = 0;

    for (const cashFlow of this._profile.cashFlows) {
      if (cashFlow instanceof CashFlowCharge) {
        // Do not include charges
        continue;
      }

      balanceCFwd = MathUtils.gaussRound(balanceCFwd + cashFlow.value, this._profile.precision);

      const tr = tbody.insertRow();
      tr.insertCell().appendChild(document.createTextNode(cashFlow.label));
      if (this._profile.dayCount.usePostingDates()) {
        tr.insertCell().appendChild(
          document.createTextNode(cashFlow.postingDate.toLocaleDateString(this._locale))
        );
      } else {
        tr.insertCell().appendChild(
          document.createTextNode(cashFlow.valueDate.toLocaleDateString(this._locale))
        );
      }
      tr.insertCell().appendChild(document.createTextNode(
        cashFlow.value.toLocaleString(this._locale,
          {
            minimumFractionDigits: this._profile.precision,
            maximumFractionDigits: this._profile.precision
          }))
      );
      if (cashFlow instanceof CashFlowPayment) {
        tr.insertCell().appendChild(document.createTextNode(
          cashFlow.interest.toLocaleString(this._locale,
            {
              minimumFractionDigits: this._profile.precision,
              maximumFractionDigits: this._profile.precision
            }))
        );
        balanceCFwd = MathUtils.gaussRound(balanceCFwd + cashFlow.interest, this._profile.precision);
      } else {
        tr.insertCell().appendChild(document.createTextNode(
          Number(0).toLocaleString(this._locale,
            {
              minimumFractionDigits: this._profile.precision,
              maximumFractionDigits: this._profile.precision
            }))
        );
      }
      tr.insertCell().appendChild(document.createTextNode(
        balanceCFwd.toLocaleString(this._locale,
          {
            minimumFractionDigits: this._profile.precision,
            maximumFractionDigits: this._profile.precision
          }))
      );
    }
    tbl.appendChild(tbody);
    containerDiv.appendChild(tbl);

    return containerDiv;
  }
}