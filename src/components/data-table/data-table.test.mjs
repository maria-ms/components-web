import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDataTableModel, DataTable } from './data-table.mjs';
const model = (widths) => ({caption:'Records',rowKey:'id',columns:widths.map((width,i)=>({id:`c${i}`,label:`Column ${i}`,...(width===undefined?{}:{width})})),rows:[]});
test('automatic widths need no designated flexible column',()=>{
  for(const widths of [[undefined,undefined],['auto','auto'],['fill','fill'],[80,120],[undefined,120]]) assert.doesNotThrow(()=>validateDataTableModel(model(widths)));
});
test('invalid width preferences and wrapping values are rejected',()=>{
  for(const width of [0,-1,Infinity,NaN,'100%',null]) assert.throws(()=>validateDataTableModel(model([width])),/width/);
  const data=model([undefined]);data.columns[0].wrap='no';assert.throws(()=>validateDataTableModel(data),/wrap/);
  data.columns[0].wrap=false;assert.doesNotThrow(()=>validateDataTableModel(data));
});
test('caption renderer is separate from serializable data',()=>{
  const table=new DataTable(); assert.equal(table.captionRenderer,null);
  assert.throws(()=>{table.captionRenderer='caption';},/function or null/);
  const renderer=()=>null;table.captionRenderer=renderer;assert.equal(table.captionRenderer,renderer);
  table.captionRenderer=null;
  assert.throws(()=>validateDataTableModel({...model([undefined]),captionRenderer:renderer}),/not supported/);
});
