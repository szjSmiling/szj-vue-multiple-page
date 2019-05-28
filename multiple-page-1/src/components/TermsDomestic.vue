<template>
  <div class="containerDo">
    <HeaderTop header-title="Insurance Details" :goBack="hideInsureDetail">
      <!-- <span slot="title_center" class="s-icon s-icon-return hide_tc" @click="hideInsureDetail"></span> -->
    </HeaderTop>
    <div class="terms_table">
      <table class="table1" border="0">
        <tr class="tr-title">
          <td class="border" >Particulars</td>
          <td>Features</td>
        </tr>
        <tr class="tr-fi">
          <td class="border">Age</td>
          <td class="noborder">The policy covers persons in the age group of 6 months to 70 years.</td>
        </tr>
        <tr class="tr-fi">
          <td class="border noborder">Coverage Type</td>
          <td class="noborder">Individual</td>
        </tr>
        <tr class="tr-title tr-title2">
          <td class="border" >Benefits</td>
          <td class="title2">
          <table border="0">
            <tr >
            <td class="border" align="center">Sum Insured</td>
            <td align="center">Deductible</td>
            </tr>
          </table>
          </td>
        </tr>
        <tr class="tr-fi">
          <td class="border">Personal Accident (Accidental Death)</td>
          <td >
          <table>
            <tr>
            <td align="center">Rs.500,000</td>
            <td align="center">Nil</td>
            </tr>
          </table>
          </td>
        </tr>
        <tr class="tr-fi">
          <td class="border">Emergency Medical expenses</td>
          <td>
            <table>
            <tr>
              <td align="center">Rs.100,000</td>
              <td align="center">Nil</td>
            </tr>
            </table>
          </td>
        </tr>
        <tr class="tr-fi">
          <td class="border">Emergency Evacuation and Repatriation</td>
          <td>
            <table>
            <tr>
              <td align="center">Rs.100,000</td>
              <td align="center">Nil</td>
            </tr>
            </table>
          </td>
        </tr>
        <tr class="tr-fi">
          <td class="border">Trip Cancellation & Interruption</td>
          <td>
            <table>
            <tr>
              <td>Upto the original cost of the ticket,subject to maximum of Rs.20,000/- whichever is lower.</td>
              <td align="center">Nil</td>
            </tr>
            </table>
          </td>
        </tr>
        <tr class="tr-fi">
          <td class="border">Trip Delay</td>
          <td>
            <table>
            <tr>
              <td>Rs 1,500/- per 5 hour delay period ,subject to maximum upto Rs.10,500/-</td>
              <td>12 Hours</td>
            </tr>
            </table>
          </td>
        </tr>
        <tr class="tr-fi">
          <td class="border">Total Loss of Checked in Baggage</td>
          <td>
            <table>
            <tr>
              <td>50% or 10% per baggage or per article limit subject to maximum of Rs.10,000</td>
              <td align="center">Nil</td>
            </tr>
            </table>
          </td>
        </tr>
        <tr class="tr-fi">
          <td class="border">Compassionate return trip by the Insured</td>
          <td>
            <table>
            <tr>
              <td>Return trip expenses for the Insured limited to 30,000</td>
              <td align="center">Nil</td>
            </tr>
            </table>
          </td>
        </tr>
        <tr class="tr-fi">
          <td class="border">Personal Liability</td>
          <td>
            <table>
              <tr>
                <td align="center">Rs.200,000</td>
                <td align="center">Nil</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr class="tr-fi">
          <td class="border">Missed flight connection</td>
          <td>
            <table>
            <tr>
              <td align="center">Rs.2,000</td>
              <td align="center">500</td>
            </tr>
            </table>
          </td>
        </tr>
        <tr class="tr-fi last-tr">
          <td class="border">Emergency Accomodation Expenses</td>
          <td>
            <table>
            <tr>
              <td class="last-tr" align="center">Rs.20,000</td>
              <td align="center">Nil</td>
            </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import HeaderTop from '@/components/Header.vue';
import EventHub from '@/utils/EventHub';
export default {
  components: {
    HeaderTop
  },
  methods: {
    hideInsureDetail () {
      EventHub.$emit('isShowInsureDetail', false);
    }
  }
};
</script>
<style lang="scss" scoped>
.containerDo{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  overflow: auto;
  background: white;
}
.hide_tc{
  position: absolute;
}
.terms_table {
  padding:0 .2rem 0.5rem;
}
.table1{
  border:1px solid #ddd;
}
table,tbody,tr{
  display:inline-block;
  width: 100% !important;
}
  // .table1{
  .table1 tr{
      display:flex;
      border-bottom:1px solid #eee;
      td{
        width:50%;
        font-size:14px;
        color:#333;
      }
    }
  .table1 tr.tr-title{
      font-weight:bold;
      td{
        padding:0.2rem 0;
      }
    }
  .table1 tr.tr-title2{
      td.title2{
        padding:0 0;
        tr{
          border-bottom:none;
          td{
            padding:0.2rem 0;
          }
        }
      }
    }
  .table1 tr.tr-fi{
      text-align: left;
      td{
        width:50%;
        background:#f9fbfb;
        table{
          height: 100%;
          tr{
            border-bottom: none;
            height: 100%;
            td{
              width:48%;
              // height: 100%;
              padding:0.1rem 0 0.1rem 2%;
              line-height: 0.35rem;
              display:flex;
              // justify-content:center;
              align-items: center;
              // white-space:nowrap;
              // overflow-x:auto;
            }
            td:nth-child(1){
              border-right:1px solid #eee;
            }
            td:nth-child(2){
              justify-content:center;
            }
          }
        }
      }
      td.border,td.noborder{
        width:48%;
        padding:0.1rem 0 0.1rem 2%;
        line-height:0.35rem;
      }
    }
    .table1 tr td.border{
      border-right: 1px solid #eee;
    }
    .table1 tr.last-tr{
      border-bottom:none;
    }
  // }
</style>
