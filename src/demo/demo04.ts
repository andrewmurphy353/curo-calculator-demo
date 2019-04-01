import { Calculator, Frequency, Mode, SeriesAdvance, SeriesPayment, US30360 } from "@curo/calculator";
import ScheduleBuilder from "../schedule-builder";

export default function runDemo04() {

  // Problem definition
  document.getElementById("demoTitle").innerText = "DEMO 4: Solve Unknown Payment with Irregular Interest Compounding";
  document.getElementById("demoDef1").innerText = "An individual secures a loan of 10,000.00 repayable by 36 monthly instalments in arrears. The lender's effective annual interest rate is 8.25% and interest is compounded quarterly (not monthly). This scenario is illustrated below.";
  (<HTMLImageElement>document.getElementById("demoCfd")).src = "./images/demo04.png";
  document.getElementById("demoDef2").innerText = "Using the US 30/360 day count convention, compute the value of the unknown payments and the lender's IRR."

  
  const calc = new Calculator();
  const today = new Date();

  // Define the cash flow series
  calc.add(
    SeriesAdvance.builder()
      .setLabel("Loan advance")
      .setAmount(10000.0)
      .setDrawdownFrom(today)
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(36)
      .setLabel("Instalment")
      .setMode(Mode.Arrear)
      .setDueOnOrFrom(today)
      .setIsIntCap(false) // Important to override default true
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(12)
      .setLabel("Interest")
      .setAmount(0.0) // Important to set pmt amount to zero
      .setMode(Mode.Arrear)
      .setFrequency(Frequency.Quarterly)
      .setDueOnOrFrom(today)
      .setIsIntCap(true)
      .build()
  );

  // Calculate the unknown payment
  const pmtResult = calc.solveValue(new US30360(), 0.0825);
  document.getElementById("demoPayment").innerText =
    "Payment result: " + pmtResult.toFixed(calc.precision);

  // Calculate the lender's IRR
  const rateDecimal = calc.solveRate(new US30360());
  const ratePercent = rateDecimal * 100;
  document.getElementById("demoRate").innerText =
    "Lender IRR: " + ratePercent.toFixed(3) + "%  (to 3 decimal places)";

  // Display the results in a schedule
  document.getElementById("demoSchedule").appendChild(
    new ScheduleBuilder(calc.profile, "en-IE").buildSchedule(rateDecimal)
  );
}
