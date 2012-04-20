
use crunchbase;

map = function() {
    if (!this.tag_list_array) {
        return;
    }

    for (index in this.tag_list_array) {
        emit(this.tag_list_array[index], 1);
    }
}

reduce = function(previous, current) {
    var count = 0;

    for (index in current) {
        count += current[index];
    }

    return count;
}

result = db.runCommand({"mapreduce" : "plain_companies",
			"map" : map,
			"reduce" : reduce,
			"out" : "tags"});