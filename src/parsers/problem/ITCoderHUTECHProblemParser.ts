import { Sendable } from '../../models/Sendable';
import { TaskBuilder } from '../../models/TaskBuilder';
import { htmlToElement } from '../../utils/dom';
import { Parser } from '../Parser';

export class ITCoderHUTECHProblemParser extends Parser {
  public getMatchPatterns(): string[] {
    return ['https://itcoder.hutech.edu.vn/p/*'];
  }

  public async parse(url: string, html: string): Promise<Sendable> {
    const doc = htmlToElement(html);
    const task = new TaskBuilder('ITCoder HUTECH').setUrl(url);

    task.setName(doc.querySelector('h2').textContent);

    const [timeLimit, memoryLimit] = [...doc.querySelectorAll('.card-body .float-right')].map(el =>
      parseInt(el.textContent.match(/\d+/)[0]),
    );

    task.setTimeLimit(timeLimit * 1000);
    task.setMemoryLimit(memoryLimit);

    doc.querySelectorAll('.sample-test').forEach(sample => {
      const input = sample.querySelector('.sample-input-text').textContent;
      const output = sample.querySelector('.sample-output-text').textContent;
      task.addTest(input, output);
    });

    return task.build();
  }
}
